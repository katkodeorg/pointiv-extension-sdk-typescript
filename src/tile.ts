// Declarative tile widgets rendered by Pointiv around the popup command bar.
//
// A tile is data. Your extension exports a `render_tile` function that returns
// a TileUi tree, the host validates it and renders native widgets. Declare the
// tile in pointiv-extension.json with a "tiles" block. The host calls
// render_tile when the popup opens and again after a tile action runs, with a
// 3 second budget and storage-only host access. Action commands run through
// your normal `execute` function with the exact declared command string.
//
// Limits enforced by the host: 16 nodes per tile, nesting depth 3, 16KB of
// JSON, title 80 chars, subtitle 120, text 300, badge and action labels 40,
// action commands 512, 2 actions per row, 3 footer actions.

/** Color tone for text, badges and countdowns. */
export type TileTone = "neutral" | "ok" | "warn" | "danger";

/** A clickable action. The host runs `command` through your `execute` function. */
export interface TileAction {
  label: string;
  command: string;
  /** Placeholder text. When set, the host renders a text field next to the
      button and dispatches `command` plus a space plus the typed text.
      Placeholder max 60 characters. */
  input?: string;
}

/** A small status chip attached to a row. */
export interface TileBadge {
  label: string;
  tone?: TileTone;
}

export interface TileTextNode {
  type: "text";
  text: string;
  tone?: TileTone;
  muted?: boolean;
}

export interface TileRowNode {
  type: "row";
  text: string;
  secondary?: string;
  badge?: TileBadge;
  actions?: TileAction[];
}

export interface TileBadgeNode {
  type: "badge";
  label: string;
  tone?: TileTone;
}

export interface TileProgressNode {
  type: "progress";
  /** Fill fraction between 0 and 1. */
  value: number;
  label?: string;
}

export interface TileCountdownNode {
  type: "countdown";
  /** RFC3339 timestamp the host counts down to. */
  deadline: string;
  label?: string;
  tone?: TileTone;
}

export interface TileDividerNode {
  type: "divider";
}

export interface TileComponentNode {
  type: "component";
  /** Catalog name, e.g. "mui-button". See the TILES.md component catalog. */
  component: string;
  props?: Record<string, unknown>;
  /** Child nodes. Only "mui-stack" accepts children. */
  children?: TileNode[];
}

export type TileNode =
  | TileTextNode
  | TileRowNode
  | TileBadgeNode
  | TileProgressNode
  | TileCountdownNode
  | TileDividerNode
  | TileComponentNode;

/** The full tile returned by `render_tile`. */
export interface TileUi {
  title: string;
  subtitle?: string;
  body: TileNode[];
  footer?: TileAction[];
}

/** Input passed to your `render_tile` function. */
export interface TileRenderInput {
  /** Current time as an RFC3339 timestamp. */
  now: string;
}

/** Read the render input inside `render_tile`. */
export function readTileInput(): TileRenderInput {
  return JSON.parse(Host.inputString()) as TileRenderInput;
}

/** Write the finished tile as the `render_tile` output. */
export function writeTileOutput(tile: TileUi): void {
  Host.outputString(JSON.stringify(tile));
}

/** Builder helpers. Each returns a plain wire-format object. */
export const tile = {
  ui(
    title: string,
    body: TileNode[],
    options?: { subtitle?: string; footer?: TileAction[] },
  ): TileUi {
    const ui: TileUi = { title, body };
    if (options?.subtitle !== undefined) ui.subtitle = options.subtitle;
    if (options?.footer !== undefined) ui.footer = options.footer;
    return ui;
  },

  action(label: string, command: string, input?: string): TileAction {
    const a: TileAction = { label, command };
    if (input !== undefined) a.input = input;
    return a;
  },

  text(text: string, options?: { tone?: TileTone; muted?: boolean }): TileTextNode {
    return { type: "text", text, ...options };
  },

  row(
    text: string,
    options?: { secondary?: string; badge?: TileBadge; actions?: TileAction[] },
  ): TileRowNode {
    return { type: "row", text, ...options };
  },

  badge(label: string, tone?: TileTone): TileBadgeNode {
    return tone === undefined
      ? { type: "badge", label }
      : { type: "badge", label, tone };
  },

  progress(value: number, label?: string): TileProgressNode {
    return label === undefined
      ? { type: "progress", value }
      : { type: "progress", value, label };
  },

  countdown(
    deadline: string,
    options?: { label?: string; tone?: TileTone },
  ): TileCountdownNode {
    return { type: "countdown", deadline, ...options };
  },

  divider(): TileDividerNode {
    return { type: "divider" };
  },

  component(
    component: string,
    props: Record<string, unknown>,
    children?: TileNode[],
  ): TileComponentNode {
    return children === undefined
      ? { type: "component", component, props }
      : { type: "component", component, props, children };
  },
};
