import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthJwtPayload } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the current user from the HTTP-only JWT cookie (no password or raw token in body).
 */
export async function GET() {
  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as AuthJwtPayload & { sub: string };

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name ?? "",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
}
