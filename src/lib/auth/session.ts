import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthJwtPayload } from "@/lib/auth/jwt";

export type SessionUser = AuthJwtPayload & { sub: string };

/**
 * Resolves the current user from the HTTP-only JWT cookie (Route Handlers only).
 */
export async function getAuthenticatedUser(): Promise<SessionUser | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, secret) as SessionUser;
  } catch {
    return null;
  }
}
