import { pointivHttpRequest } from "./host-calls.js";
import type { HttpRequest, HttpResponse } from "./types.js";

function parseResponse(raw: string): HttpResponse {
  try {
    const data = JSON.parse(raw) as HttpResponse;
    return {
      status: typeof data.status === "number" ? data.status : 0,
      body: typeof data.body === "string" ? data.body : "",
    };
  } catch {
    return { status: 0, body: "" };
  }
}

export const http = {
  request(req: HttpRequest): HttpResponse {
    return parseResponse(pointivHttpRequest(JSON.stringify(req)));
  },

  get(url: string): HttpResponse {
    return http.request({ method: "GET", url, headers: {}, body: "" });
  },

  post(url: string, body: string): HttpResponse {
    return http.request({ method: "POST", url, headers: {}, body });
  },
};
