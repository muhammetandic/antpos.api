import { Document, model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";
import { ISoftDelete } from "../../../common/schemes/soft-delete.js";

export interface IUser extends ISoftDelete, Document {
  _id: SchemaDefinitionProperty<ObjectId>;
  email: string;
  phone?: string;
  name: string;
  password: string;
  salt?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  createdAt: Date;
}

const userScheme = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: false },
  name: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: false },
  emailVerified: { type: Boolean, required: true, default: false },
  phoneVerified: { type: Boolean, required: false, default: false },
  isDeleted: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const User = model<IUser>("User", userScheme);
