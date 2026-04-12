import { NextRequest, NextResponse } from "next/server";
import { registerBodySchema } from "@/lib/validation/register";
import {
  DuplicateEmailError,
  registerUser,
} from "@/lib/services/registerUser";
import { mapInfrastructureFailure } from "@/lib/server/mapInfrastructureFailure";

/**
 * App Router Route Handler — not Express.
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapRegisterFailure(err: unknown): { status: number; body: { error: string } } {
  if (err instanceof DuplicateEmailError) {
    return { status: 409, body: { error: err.message } };
  }

  const infra = mapInfrastructureFailure(err);
  if (infra) return infra;

  console.error("[api/register]", err);
  return {
    status: 500,
    body: { error: "Something went wrong. Please try again later." },
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.JWT_SECRET) {
    console.error("[api/register] JWT_SECRET is not set");
    return NextResponse.json(
      {
        error:
          "Server is not configured. Add JWT_SECRET to .env.local (copy from .env.example) and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = registerBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const { user, token } = await registerUser(parsed.data);

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful. Welcome to SereneMind.",
        user,
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const { status, body } = mapRegisterFailure(err);
    return NextResponse.json(body, { status });
  }
}
