import { pointivLog } from "./host-calls.js";

function emit(level: string, msg: string): void {
  pointivLog(`[${level}] ${msg}`);
}

export const log = {
  info: (msg: string) => emit("INFO", msg),
  warn: (msg: string) => emit("WARN", msg),
  error: (msg: string) => emit("ERROR", msg),
};
