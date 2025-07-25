import mongoose from "mongoose";
import { IMailQueue, MailQueue } from "../common/schemes/mail-queue.js";
import { sendMailWithParametersAsync } from "./mail-sender.service.js";

const mongoUri = process.env.MONGO_URI as string;

mongoose.connection.once("open", () => {
  console.log("[mongo]: MongoDB connection ready");
});

mongoose.connection.on("error", (error) => {
  console.log("[mongo]: MongoDB connection error", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("[mongo]: MongoDB connection disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("[mongo]: MongoDB connection reconnected");
});

mongoose.connection.on("close", () => {
  console.log("[mongo]: MongoDB connection close");
});

mongoose.connection.on("SIGINT", () => {
  console.log("[mongo]: MongoDB connection SIGINT");
  mongoose.connection.close();
  process.exit(0);
});

export async function connectMongo() {
  await mongoose.connect(mongoUri);

  const mailQueueCollection = mongoose.connection.collection("mailqueues");
  const mailQueueStream = mailQueueCollection.watch();

  mailQueueStream.on("change", async (change: mongoose.mongo.ChangeStreamDocument<IMailQueue>) => {
    try {
      if (change.operationType === "insert") {
        const { _id, mailKind, parameters } = change.fullDocument;
        await sendMailWithParametersAsync(mailKind, parameters);
        await MailQueue.deleteOne({ _id });
      }
    } catch (error) {
      console.log("[mail]: error sending mail", error);
    }
  });
}
