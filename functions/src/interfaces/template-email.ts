export interface TemplateEmail {
    id: string | null;
    subject: string;
    body: string;
    type: TemplateEmailType;
    name: string;
    description: string;
    recipientType: TemplateEmailRecipientType;
  }
  
  export type TemplateEmailType =
    | "membercreate"
    | "memberdelete"
    | "adminusercreate"
    | "adminuserdelete"
    | "custom"
    | null;
  
  export type TemplateEmailRecipientType = "member" | "adminuser" | null;
  