import { pointivAiComplete } from "./host-calls.js";

export const ai = {
  complete(prompt: string): string {
    return pointivAiComplete(prompt);
  },
};
