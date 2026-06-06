import { pointivClipboardRead } from "./host-calls.js";

export const clipboard = {
  read(): string {
    return pointivClipboardRead();
  },
};
