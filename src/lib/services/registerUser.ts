import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signAuthToken } from "@/lib/auth/jwt";
import type { RegisterBody } from "@/lib/validation/register";

export class DuplicateEmailError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "DuplicateEmailError";
  }
}

export type RegisterResult = {
  user: { id: string; name: string; email: string };
  token: string;
};

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  );
}

/**
 * Persists a new user and returns a JWT for session cookie (set in the Route Handler).
 */
export async function registerUser(input: RegisterBody): Promise<RegisterResult> {
  await connectDB();

  const email = input.email.toLowerCase();

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new DuplicateEmailError();
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await User.create({
      name: input.name,
      email,
      password: passwordHash,
    });

    const token = signAuthToken(user._id.toString(), user.email, user.name);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (err: unknown) {
    if (isDuplicateKeyError(err)) {
      throw new DuplicateEmailError();
    }
    throw err;
  }
}
