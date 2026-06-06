import { pointivGoogleGmailSend } from "./host-calls.js";

export const googleGmail = {
  send(to: string, subject: string, body: string): Record<string, unknown> {
    const raw = pointivGoogleGmailSend(JSON.stringify({ to, subject, body }));
    const result = JSON.parse(raw) as Record<string, unknown>;
    if (typeof result.error === "string") {
      throw new Error(result.error);
    }
    return result;
  },
};
