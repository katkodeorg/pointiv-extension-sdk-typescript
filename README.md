# @katkode/pointiv-extension-sdk

TypeScript SDK for [Pointiv](https://pointiv.katkode.com) WASM extensions.

Compiles to `extension.wasm` with [extism-js](https://github.com/extism/js-pdk).

## Install

```sh
npm install @katkode/pointiv-extension-sdk @extism/js-pdk
npm install -D esbuild
```

Install the `extism-js` CLI and Binaryen before building WASM.

## Setup

```ts
import {
  Output,
  readInput,
  writeOutput,
  storage,
  type Input,
} from "@katkode/pointiv-extension-sdk";

export function execute() {
  const input = readInput();
  const count = Number.parseInt(storage.read("run_count") ?? "0", 10) + 1;
  storage.write("run_count", String(count));
  writeOutput(Output.text(`Hello, ${input.text || "World"}! Run #${count}`));
}
```

Bundle to CJS (`es2020`), then:

```sh
extism-js dist/index.js -i src/index.d.ts -o extension.wasm
```

Set `runtime: "wasm"` and `main: "extension.wasm"` in `pointiv-extension.json`.

## APIs

| Module | Permission | What it does |
|--------|------------|--------------|
| `storage` | `storage` | Per-extension key/value store |
| `clipboard` | `clipboard_read` | Read clipboard |
| `ai` | `ai` | LLM completion |
| `http` | `network` | Outbound HTTP |
| `googleCalendar` | `google_calendar` | Create Calendar events |
| `googleGmail` | `google_gmail` | Send Gmail |
| `log` | none | Log to Pointiv trace |

## License

MIT
