type PointivHost = {
  pointiv_log: (ptr: I64) => void;
  pointiv_storage_read: (ptr: I64) => I64;
  pointiv_storage_write: (key: I64, value: I64) => void;
  pointiv_storage_delete: (ptr: I64) => void;
  pointiv_storage_list: () => I64;
  pointiv_clipboard_read: () => I64;
  pointiv_ai_complete: (ptr: I64) => I64;
  pointiv_http_request: (ptr: I64) => I64;
  pointiv_google_calendar_create: (ptr: I64) => I64;
  pointiv_google_gmail_send: (ptr: I64) => I64;
};

const host = Host.getFunctions() as PointivHost;

function readString(ptr: I64): string {
  // Extism uses offset 0 for empty/null allocations; Memory.find(0) is undefined in extism-js.
  // I64 may be a number or a bigint, so compare via Number() to catch 0n too.
  if (Number(ptr) === 0) return "";
  return Memory.find(ptr).readString();
}

function writeString(value: string): I64 {
  return Memory.fromString(value).offset;
}

export function pointivLog(msg: string): void {
  host.pointiv_log(writeString(msg));
}

export function pointivStorageRead(key: string): string {
  return readString(host.pointiv_storage_read(writeString(key)));
}

export function pointivStorageWrite(key: string, value: string): void {
  host.pointiv_storage_write(writeString(key), writeString(value));
}

export function pointivStorageDelete(key: string): void {
  host.pointiv_storage_delete(writeString(key));
}

export function pointivStorageList(): string {
  return readString(host.pointiv_storage_list());
}

export function pointivClipboardRead(): string {
  return readString(host.pointiv_clipboard_read());
}

export function pointivAiComplete(prompt: string): string {
  return readString(host.pointiv_ai_complete(writeString(prompt)));
}

export function pointivHttpRequest(requestJson: string): string {
  return readString(host.pointiv_http_request(writeString(requestJson)));
}

export function pointivGoogleCalendarCreate(payloadJson: string): string {
  return readString(host.pointiv_google_calendar_create(writeString(payloadJson)));
}

export function pointivGoogleGmailSend(payloadJson: string): string {
  return readString(host.pointiv_google_gmail_send(writeString(payloadJson)));
}
