import type { ExtensionOutput, Input } from "./types.js";

export function readInput(): Input {
  return JSON.parse(Host.inputString()) as Input;
}

export function writeOutput(output: ExtensionOutput): void {
  Host.outputString(JSON.stringify(output));
}
