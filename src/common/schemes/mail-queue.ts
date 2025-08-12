import { Document, model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";
import { MailKind } from "../enums/mail-kind.js";

export type TMailMessageParameters = {
  mail: string;
  name: string;
  otp?: string;
  controlCode?: string;
};

export interface IMailQueue extends Document {
  userId: SchemaDefinitionProperty<ObjectId>;
  mailKind: MailKind;
  parameters: TMailMessageParameters;
}

const mailQueueScheme = new Schema<IMailQueue>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mailKind: { type: String, required: true },
  parameters: { type: Object, required: true },
});

export const MailQueue = model<IMailQueue>("MailQueue", mailQueueScheme);
