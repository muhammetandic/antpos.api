import { Document, model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";
import { TokenType } from "../constants/token-type.js";

export interface IUserToken extends Document {
  userId: SchemaDefinitionProperty<ObjectId>;
  type: TokenType;
  token: string;
  otp?: string;
  expiresAt: Date;
}

const userTokenScheme = new Schema<IUserToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  token: { type: String, required: true },
  otp: { type: String, required: false },
  expiresAt: { type: Date, required: true },
});

export const UserToken = model<IUserToken>("UserToken", userTokenScheme);
