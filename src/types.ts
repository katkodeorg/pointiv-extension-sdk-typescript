export interface Input {
  text: string;
  context: string;
  command: string;
}

export type OutputKind = "text" | "copy" | "type" | "error";

export interface ExtensionOutput {
  type: OutputKind;
  value: string;
}

export interface HttpRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

export interface HttpResponse {
  status: number;
  body: string;
}
