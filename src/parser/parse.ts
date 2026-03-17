export interface ParsedChar {
  raw: string;
  hex: string;
  meaning: string;
}

export interface ParseResult {
  chars: ParsedChar[];
  summary: string;
}

/** Normalize various ESC representations to actual \x1b */
function normalizeInput(input: string): string {
  // \x1b or \x1B → ESC
  let s = input.replace(/\\x1[bB]/g, "\x1b");
  // \033 → ESC
  s = s.replace(/\\033/g, "\x1b");
  // \e → ESC
  s = s.replace(/\\e/g, "\x1b");
  // \u001b or \u001B → ESC
  s = s.replace(/\\u001[bB]/g, "\x1b");
  // \u{1b} or \u{1B} → ESC
  s = s.replace(/\\u\{1[bB]\}/g, "\x1b");
  // ^[ → ESC
  s = s.replace(/\^\[/g, "\x1b");
  return s;
}

const finalByteNames: Record<string, string> = {
  A: "CUU — Cursor Up",
  B: "CUD — Cursor Down",
  C: "CUF — Cursor Forward",
  D: "CUB — Cursor Back",
  E: "CNL — Cursor Next Line",
  F: "CPL — Cursor Previous Line",
  G: "CHA — Cursor Horizontal Absolute",
  H: "CUP — Cursor Position",
  J: "ED — Erase in Display",
  K: "EL — Erase in Line",
  S: "SU — Scroll Up",
  T: "SD — Scroll Down",
  I: "CHT — Cursor Horizontal Tab",
  Z: "CBT — Cursor Backward Tab",
  a: "HPR — Horizontal Position Relative",
  b: "REP — Repeat Preceding Character",
  d: "VPA — Vertical Position Absolute",
  e: "VPR — Vertical Position Relative",
  f: "HVP — Horizontal Vertical Position",
  "`": "HPA — Horizontal Position Absolute",
  h: "SM — Set Mode (enable)",
  l: "RM — Reset Mode (disable)",
  m: "SGR — Select Graphic Rendition",
  n: "DSR — Device Status Report",
  q: "DECSCUSR — Set Cursor Style",
  r: "DECSTBM — Set Scrolling Region",
  s: "SCP — Save Cursor Position",
  u: "RCP — Restore Cursor Position",
};

const sgrCodes: Record<number, string> = {
  0: "Reset all styles",
  1: "Bold",
  2: "Dim (faint)",
  3: "Italic",
  4: "Underline",
  5: "Blink (slow)",
  6: "Blink (rapid)",
  7: "Reverse (swap fg/bg)",
  8: "Hidden",
  9: "Strikethrough",
  22: "Normal intensity",
  23: "Not italic",
  24: "Not underlined",
  25: "Not blinking",
  27: "Not reversed",
  28: "Not hidden",
  29: "Not strikethrough",
  39: "Default foreground",
  49: "Default background",
};

const decModes: Record<number, string> = {
  1: "DECCKM — Cursor Keys Mode",
  6: "DECOM — Origin Mode",
  7: "DECAWM — Auto-Wrap Mode",
  25: "DECTCEM — Text Cursor Enable (visibility)",
  47: "Alternate Screen Buffer (xterm)",
  1000: "Mouse Click Tracking",
  1002: "Mouse Cell Motion Tracking",
  1003: "Mouse All Motion Tracking",
  1006: "SGR Mouse Mode",
  1049: "Alternate Screen Buffer with save/restore (xterm)",
  2004: "Bracketed Paste Mode",
};

const edCodes: Record<number, string> = {
  0: "Erase from cursor to end of screen",
  1: "Erase from cursor to beginning of screen",
  2: "Erase entire screen",
  3: "Erase screen and scrollback buffer",
};

const elCodes: Record<number, string> = {
  0: "Erase from cursor to end of line",
  1: "Erase from cursor to beginning of line",
  2: "Erase entire line",
};

function getFgColorName(n: number): string {
  const colors = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"];
  if (n >= 30 && n <= 37) return `Foreground: ${colors[n - 30]}`;
  if (n >= 90 && n <= 97) return `Foreground: Bright ${colors[n - 90]}`;
  return `SGR ${n}`;
}

function getBgColorName(n: number): string {
  const colors = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"];
  if (n >= 40 && n <= 47) return `Background: ${colors[n - 40]}`;
  if (n >= 100 && n <= 107) return `Background: Bright ${colors[n - 100]}`;
  return `SGR ${n}`;
}

function describeSgrParams(params: number[]): string {
  if (params.length === 0 || (params.length === 1 && params[0] === 0)) {
    return "Reset all styles";
  }

  const parts: string[] = [];
  let i = 0;
  while (i < params.length) {
    const p = params[i]!;
    if ((p === 38 || p === 48) && params[i + 1] === 5 && params[i + 2] !== undefined) {
      const label = p === 38 ? "Foreground" : "Background";
      parts.push(`${label}: 256-color index ${params[i + 2]}`);
      i += 3;
    } else if ((p === 38 || p === 48) && params[i + 1] === 2 && params[i + 4] !== undefined) {
      const label = p === 38 ? "Foreground" : "Background";
      parts.push(`${label}: RGB(${params[i + 2]}, ${params[i + 3]}, ${params[i + 4]})`);
      i += 5;
    } else if (p >= 30 && p <= 37 || p >= 90 && p <= 97) {
      parts.push(getFgColorName(p));
      i++;
    } else if (p >= 40 && p <= 47 || p >= 100 && p <= 107) {
      parts.push(getBgColorName(p));
      i++;
    } else if (sgrCodes[p]) {
      parts.push(sgrCodes[p]);
      i++;
    } else {
      parts.push(`SGR ${p}`);
      i++;
    }
  }
  return parts.join(", ");
}

function buildSummary(finalByte: string, paramStr: string, isPrivate: boolean): string {
  const params = paramStr
    .split(";")
    .filter((s) => s.length > 0)
    .map(Number);

  if (finalByte === "m") {
    return describeSgrParams(params);
  }

  if (isPrivate && (finalByte === "h" || finalByte === "l")) {
    const mode = params[0];
    const action = finalByte === "h" ? "Enable" : "Disable";
    const modeName = mode !== undefined ? decModes[mode] : undefined;
    if (modeName) return `${action}: ${modeName}`;
    return `${action} private mode ${mode ?? "?"}`;
  }

  if (finalByte === "H" || finalByte === "f") {
    if (params.length === 0 || (params.length === 2 && params[0] === 1 && params[1] === 1)) {
      return "Move cursor to top-left (1,1)";
    }
    return `Move cursor to row ${params[0] ?? 1}, column ${params[1] ?? 1}`;
  }

  if (finalByte === "J") {
    const n = params[0] ?? 0;
    return edCodes[n] ?? `Erase in display (mode ${n})`;
  }

  if (finalByte === "K") {
    const n = params[0] ?? 0;
    return elCodes[n] ?? `Erase in line (mode ${n})`;
  }

  if (finalByte === "A") return `Move cursor up ${params[0] ?? 1} line(s)`;
  if (finalByte === "B") return `Move cursor down ${params[0] ?? 1} line(s)`;
  if (finalByte === "C") return `Move cursor forward ${params[0] ?? 1} column(s)`;
  if (finalByte === "D") return `Move cursor back ${params[0] ?? 1} column(s)`;
  if (finalByte === "E") return `Move to start of line, ${params[0] ?? 1} line(s) down`;
  if (finalByte === "F") return `Move to start of line, ${params[0] ?? 1} line(s) up`;
  if (finalByte === "G" || finalByte === "`") return `Move cursor to column ${params[0] ?? 1}`;
  if (finalByte === "d") return `Move cursor to row ${params[0] ?? 1}`;
  if (finalByte === "e") return `Move cursor down ${params[0] ?? 1} row(s) (relative)`;
  if (finalByte === "a") return `Move cursor forward ${params[0] ?? 1} column(s) (relative)`;
  if (finalByte === "I") return `Advance cursor by ${params[0] ?? 1} tab stop(s)`;
  if (finalByte === "Z") return `Move cursor back by ${params[0] ?? 1} tab stop(s)`;
  if (finalByte === "b") return `Repeat preceding character ${params[0] ?? 1} time(s)`;
  if (finalByte === "s") return "Save cursor position";
  if (finalByte === "u") return "Restore cursor position";

  if (finalByte === "q") {
    const n = params[0] ?? 0;
    const shapes: Record<number, string> = {
      0: "Default cursor shape",
      1: "Blinking block cursor",
      2: "Steady block cursor",
      3: "Blinking underline cursor",
      4: "Steady underline cursor",
      5: "Blinking bar cursor",
      6: "Steady bar cursor",
    };
    return shapes[n] ?? `Set cursor style ${n}`;
  }

  const name = finalByteNames[finalByte];
  if (name) return name;
  return "Unknown sequence";
}

export function parse(input: string): ParseResult | null {
  const normalized = normalizeInput(input.trim());

  // Must start with ESC
  if (!normalized.startsWith("\x1b")) return null;

  // Must have CSI: ESC [
  if (normalized.length < 2 || normalized[1] !== "[") return null;

  const chars: ParsedChar[] = [];

  // ESC
  chars.push({ raw: "ESC", hex: "0x1B", meaning: "Escape — start of sequence" });

  // [
  chars.push({ raw: "[", hex: "0x5B", meaning: "CSI — Control Sequence Introducer (with ESC)" });

  let pos = 2;
  let isPrivate = false;

  // Private mode prefix?
  if (pos < normalized.length && "?>=<".includes(normalized[pos]!)) {
    const ch = normalized[pos]!;
    isPrivate = ch === "?";
    const labels: Record<string, string> = {
      "?": "Private mode marker (DEC)",
      ">": "Private mode marker",
      "=": "Private mode marker",
      "<": "Private mode marker",
    };
    chars.push({
      raw: ch,
      hex: "0x" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
      meaning: labels[ch] ?? "Private mode marker",
    });
    pos++;
  }

  // Parameter bytes and intermediate bytes
  let paramStr = "";
  let intermediateStr = "";

  // Collect parameters (0x30-0x3B: 0-9 ; :)
  while (pos < normalized.length) {
    const code = normalized.charCodeAt(pos);
    if (code >= 0x30 && code <= 0x3b) {
      const ch = normalized[pos]!;
      paramStr += ch;
      if (ch === ";") {
        chars.push({ raw: ";", hex: "0x3B", meaning: "Parameter separator" });
      } else {
        chars.push({
          raw: ch,
          hex: "0x" + code.toString(16).toUpperCase().padStart(2, "0"),
          meaning: `Parameter digit`,
        });
      }
      pos++;
    } else {
      break;
    }
  }

  // Collect intermediate bytes (0x20-0x2F)
  while (pos < normalized.length) {
    const code = normalized.charCodeAt(pos);
    if (code >= 0x20 && code <= 0x2f) {
      const ch = normalized[pos]!;
      intermediateStr += ch;
      chars.push({
        raw: ch === " " ? "SP" : ch,
        hex: "0x" + code.toString(16).toUpperCase().padStart(2, "0"),
        meaning: "Intermediate byte",
      });
      pos++;
    } else {
      break;
    }
  }

  // Final byte (0x40-0x7E)
  if (pos < normalized.length) {
    const code = normalized.charCodeAt(pos);
    if (code >= 0x40 && code <= 0x7e) {
      const ch = normalized[pos]!;
      const name = finalByteNames[ch];
      chars.push({
        raw: ch,
        hex: "0x" + code.toString(16).toUpperCase().padStart(2, "0"),
        meaning: name ? `Final byte — ${name}` : `Final byte (${ch})`,
      });

      // Merge consecutive parameter digits in the chars array
      mergeParameterDigits(chars);

      const summary = buildSummary(ch, paramStr, isPrivate);
      return { chars, summary };
    }
  }

  return null;
}

/** Merge consecutive parameter digit entries into a single entry showing the full number */
function mergeParameterDigits(chars: ParsedChar[]): void {
  let i = 0;
  while (i < chars.length) {
    if (chars[i]!.meaning === "Parameter digit") {
      let j = i;
      let numStr = "";
      while (j < chars.length && chars[j]!.meaning === "Parameter digit") {
        numStr += chars[j]!.raw;
        j++;
      }
      if (numStr.length > 1) {
        chars.splice(i, j - i, {
          raw: numStr,
          hex: chars.slice(i, j).map((c) => c.hex).join(" "),
          meaning: `Parameter: ${numStr}`,
        });
      } else {
        chars[i]!.meaning = `Parameter: ${numStr}`;
      }
    }
    i++;
  }
}
