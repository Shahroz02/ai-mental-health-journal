import { NextRequest, NextResponse } from "next/server";
import { loginBodySchema } from "@/lib/validation/login";
import {
  InvalidCredentialsError,
  loginUser,
} from "@/lib/services/loginUser";
import { mapInfrastructureFailure } from "@/lib/server/mapInfrastructureFailure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapLoginFailure(err: unknown): { status: number; body: { error: string } } {
  if (err instanceof InvalidCredentialsError) {
    return { status: 401, body: { error: err.message } };
  }

  const infra = mapInfrastructureFailure(err);
  if (infra) return infra;

  console.error("[api/login]", err);
  return {
    status: 500,
    body: { error: "Something went wrong. Please try again later." },
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.JWT_SECRET) {
    console.error("[api/login] JWT_SECRET is not set");
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
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginBodySchema.safeParse(json);
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
    const { user, token } = await loginUser(parsed.data);

    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        user,
      },
      { status: 200 },
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
    const { status, body } = mapLoginFailure(err);
    return NextResponse.json(body, { status });
  }
}
