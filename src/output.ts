import type { ExtensionOutput, OutputKind } from "./types.js";

function make(kind: OutputKind, value: string): ExtensionOutput {
  return { type: kind, value };
}

export const Output = {
  text(value: string): ExtensionOutput {
    return make("text", value);
  },

  copy(value: string): ExtensionOutput {
    return make("copy", value);
  },

  typeText(value: string): ExtensionOutput {
    return make("type", value);
  },

  error(value: string): ExtensionOutput {
    return make("error", value);
  },
};
