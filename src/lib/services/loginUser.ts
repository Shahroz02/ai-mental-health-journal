import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signAuthToken } from "@/lib/auth/jwt";

/** Same message for unknown user and wrong password (no user enumeration). */
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export type LoginResult = {
  user: { id: string; name: string; email: string };
  token: string;
};

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  await connectDB();

  const email = input.email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password").exec();

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordOk = await bcrypt.compare(input.password, user.password);
  if (!passwordOk) {
    throw new InvalidCredentialsError();
  }

  const token = signAuthToken(user._id.toString(), user.email, user.name);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
}
