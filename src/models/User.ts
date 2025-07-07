import { Document } from "mongoose";
import { model } from "mongoose";
import { Schema } from "mongoose";
import { Types } from "mongoose";

export interface User {
  fullname: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = Document<Types.ObjectId> & User;

const userSchema = new Schema<UserDocument>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
  },
});

export const UserModel = model<UserDocument>("User", userSchema);
