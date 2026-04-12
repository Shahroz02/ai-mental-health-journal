import jwt from "jsonwebtoken";

export function signAuthToken(
  userId: string,
  email: string,
  name: string,
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: userId, email, name }, secret, { expiresIn: "7d" });
}

export type AuthJwtPayload = {
  sub: string;
  email: string;
  /** Present for tokens issued after AM-02 (name in JWT payload). */
  name?: string;
};
