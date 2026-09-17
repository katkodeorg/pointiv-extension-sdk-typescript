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

## Tiles

Extensions can render a declarative tile widget beside the popup command bar. Declare a `"tiles"` block in `pointiv-extension.json` (requires `"runtime": "wasm"`), export `render_tile` from your entry file, and add it to the `"main"` module declaration in your `.d.ts`:

```ts
import { tile, writeTileOutput } from "@katkode/pointiv-extension-sdk";

export function render_tile() {
  writeTileOutput(
    tile.ui(
      "Todos",
      [
        tile.badge("2 open", "warn"),
        tile.row("Buy milk", { actions: [tile.action("Done", "todo done 1")] }),
      ],
      { footer: [tile.action("Refresh", "todo list")] },
    ),
  );
}
```

```json
"tiles": { "height": 2, "zone": "right", "order": 1 }
```

The host calls `render_tile` when the popup opens and after a tile action runs, with a 3 second budget and storage-only host access. Action commands run through your normal `execute` function. Use `readTileInput()` for the `{"now":"<RFC3339>"}` input. Iterate with the playground in Pointiv Settings, Tiles: paste tile JSON for instant validation and preview, or live-render an installed extension's tile. Full schema, limits, and the component catalog are in TILES.md in the Pointiv repo.

## License

MIT
