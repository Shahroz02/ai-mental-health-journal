import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    preferences: {
      type: String,
      trim: true,
      maxlength: [500, "Preferences cannot exceed 500 characters"],
      default: "",
    },
    emotionalGoals: {
      type: String,
      trim: true,
      maxlength: [1000, "Emotional goals cannot exceed 1000 characters"],
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
      default: "",
    },
  },
  { timestamps: true },
);

export const User = models.User ?? model("User", UserSchema);
