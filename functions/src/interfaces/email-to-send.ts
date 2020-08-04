export interface EmailToSend {
  id: string;
  body: string;
  subject: string;
  recipients: EmailToSendRecipient[];
  createdAt: FirebaseFirestore.Timestamp;
  currentYear: number;
  type: EmailToSendRecipientType;
}

export interface EmailToSendRecipient {
  memberId: string;
  userId: string;
  name: string;
  email: string;
  teamId: string;
  teamName: string;
  payment: number;
}

export type EmailToSendRecipientType =
  | "adminusercreate"
  | "adminuserdelete"
  | "membercreate"
  | "memberdelete"
  | "email";
