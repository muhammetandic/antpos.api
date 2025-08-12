import { ObjectId, SchemaDefinitionProperty } from "mongoose";
import { MailQueue, TMailMessageParameters } from "../common/schemes/mail-queue.js";
import { MailKind } from "../common/enums/mail-kind.js";

export async function addToMailQueue(
  userId: SchemaDefinitionProperty<ObjectId>,
  mailKind: MailKind,
  parameters: TMailMessageParameters,
) {
  const mailQueue = await MailQueue.create({ userId, mailKind, parameters });
  await mailQueue.save();
}
