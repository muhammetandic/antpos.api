import { Document, model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";
import { MailKind } from "../../helpers/mail/mailKind.enum.js";

export type TConfirmOtpParameters = {
  mail: string;
  name: string;
  otp: string;
};

export type TWelcomeParameters = {
  mail: string;
  name: string;
};

export interface IMailQueue extends Document {
  userId: SchemaDefinitionProperty<ObjectId>;
  mailKind: MailKind;
  parameters: TConfirmOtpParameters | TWelcomeParameters;
}

const mailQueueScheme = new Schema<IMailQueue>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mailKind: { type: String, required: true },
  parameters: { type: Object, required: true },
});

export const MailQueue = model<IMailQueue>("MailQueue", mailQueueScheme);
