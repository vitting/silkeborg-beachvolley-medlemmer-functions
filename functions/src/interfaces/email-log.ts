import { EmailToSendRecipientType } from "./email-to-send";

export interface EmailLog {
  emails: string;
  sendtAt: FirebaseFirestore.Timestamp;
  type: EmailToSendRecipientType;
  status: EmailLogStatus;
  error: string;
  emailserviceId: string;
  body: string;
  subject: string;
}

export type EmailLogStatus = "ok" | "error";
