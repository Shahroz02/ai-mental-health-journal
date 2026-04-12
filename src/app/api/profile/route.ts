import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/lib/validation/profile";
import { mapInfrastructureFailure } from "@/lib/server/mapInfrastructureFailure";
import { signAuthToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function profilePublic(doc: {
  _id: unknown;
  name: string;
  email: string;
  preferences?: string;
  emotionalGoals?: string;
  bio?: string;
}) {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    preferences: doc.preferences ?? "",
    emotionalGoals: doc.emotionalGoals ?? "",
    bio: doc.bio ?? "",
  };
}

export async function GET() {
  try {
    const session = await getAuthenticatedUser();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.sub).lean();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ user: profilePublic(user) });
  } catch (err: unknown) {
    const infra = mapInfrastructureFailure(err);
    if (infra) return NextResponse.json(infra.body, { status: infra.status });
    console.error("[api/profile GET]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = profileUpdateSchema.safeParse(json);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json(
        {
          error: "Validation failed.",
          fieldErrors: flat.fieldErrors,
          formErrors: flat.formErrors,
        },
        { status: 400 },
      );
    }

    const updates: Record<string, string> = {
      name: parsed.data.name,
      preferences: parsed.data.preferences,
      emotionalGoals: parsed.data.emotionalGoals,
      bio: parsed.data.bio,
    };

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.sub,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = signAuthToken(
      user._id.toString(),
      user.email,
      user.name,
    );

    const response = NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: profilePublic(user),
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const infra = mapInfrastructureFailure(err);
    if (infra) return NextResponse.json(infra.body, { status: infra.status });
    console.error("[api/profile PUT]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
