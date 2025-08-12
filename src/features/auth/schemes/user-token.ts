import { Document, model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";
import { TokenKind } from "../constants/token-kind.js";

export interface IUserToken extends Document {
  userId: SchemaDefinitionProperty<ObjectId>;
  kind: TokenKind;
  controlCode: string;
  token?: string;
  otp?: string;
  expiresAt: Date;
}

const userTokenScheme = new Schema<IUserToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  kind: { type: String, required: true },
  controlCode: { type: String, required: true },
  token: { type: String, required: false },
  otp: { type: String, required: false },
  expiresAt: { type: Date, required: true },
});

export const UserToken = model<IUserToken>("UserToken", userTokenScheme);
