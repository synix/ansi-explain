export interface AnsiSequence {
  seq: string;
  name: string;
  description: string;
  category: Category;
}

export type Category =
  | "cursor-movement"
  | "cursor-visibility"
  | "erase"
  | "color-style"
  | "screen-buffer";

export const categoryLabels: Record<Category, string> = {
  "cursor-movement": "Cursor Movement",
  "cursor-visibility": "Cursor Visibility",
  erase: "Erase",
  "color-style": "Color & Style",
  "screen-buffer": "Screen Buffer",
};

export const nameFullForms: Record<string, string> = {
  CUU: "Cursor Up",
  CUD: "Cursor Down",
  CUF: "Cursor Forward",
  CUB: "Cursor Backward",
  CUP: "Cursor Position",
  CNL: "Cursor Next Line",
  CPL: "Cursor Previous Line",
  CHA: "Cursor Horizontal Absolute",
  SCP: "Save Cursor Position",
  RCP: "Restore Cursor Position",
  VPA: "Vertical Position Absolute",
  VPR: "Vertical Position Relative",
  HPA: "Horizontal Position Absolute",
  HPR: "Horizontal Position Relative",
  CHT: "Cursor Horizontal Tab",
  CBT: "Cursor Backward Tab",
  REP: "Repeat",
  DECTCEM: "DEC Text Cursor Enable Mode",
  DECSCUSR: "DEC Set Cursor Style",
  ED: "Erase in Display",
  EL: "Erase in Line",
  SGR: "Select Graphic Rendition",
  SM: "Set Mode",
  RM: "Reset Mode",
  DSR: "Device Status Report",
  SU: "Scroll Up",
  SD: "Scroll Down",
  HVP: "Horizontal Vertical Position",
  DECSTBM: "DEC Set Top and Bottom Margins",
};

export const sequences: AnsiSequence[] = [
  // Cursor Movement
  { seq: "\\x1b[{n}A", name: "CUU", description: "Move cursor up n lines", category: "cursor-movement" },
  { seq: "\\x1b[{n}B", name: "CUD", description: "Move cursor down n lines", category: "cursor-movement" },
  { seq: "\\x1b[{n}C", name: "CUF", description: "Move cursor forward n columns", category: "cursor-movement" },
  { seq: "\\x1b[{n}D", name: "CUB", description: "Move cursor back n columns", category: "cursor-movement" },
  { seq: "\\x1b[{n};{m}H", name: "CUP", description: "Move cursor to row n, column m", category: "cursor-movement" },
  { seq: "\\x1b[H", name: "CUP", description: "Move cursor to top-left (1,1)", category: "cursor-movement" },
  { seq: "\\x1b[{n}E", name: "CNL", description: "Move cursor to beginning of line, n lines down", category: "cursor-movement" },
  { seq: "\\x1b[{n}F", name: "CPL", description: "Move cursor to beginning of line, n lines up", category: "cursor-movement" },
  { seq: "\\x1b[{n}G", name: "CHA", description: "Move cursor to column n", category: "cursor-movement" },
  { seq: "\\x1b[{n}d", name: "VPA", description: "Move cursor to row n", category: "cursor-movement" },
  { seq: "\\x1b[{n};{m}f", name: "HVP", description: "Move cursor to row n, column m", category: "cursor-movement" },
  { seq: "\\x1b[{n}e", name: "VPR", description: "Move cursor down n rows (relative)", category: "cursor-movement" },
  { seq: "\\x1b[{n}a", name: "HPR", description: "Move cursor forward n columns (relative)", category: "cursor-movement" },
  { seq: "\\x1b[{n}`", name: "HPA", description: "Move cursor to column n", category: "cursor-movement" },
  { seq: "\\x1b[{n}I", name: "CHT", description: "Advance cursor by n tab stops", category: "cursor-movement" },
  { seq: "\\x1b[{n}Z", name: "CBT", description: "Move cursor back by n tab stops", category: "cursor-movement" },
  { seq: "\\x1b[{n}b", name: "REP", description: "Repeat preceding character n times", category: "cursor-movement" },
  { seq: "\\x1b[s", name: "SCP", description: "Save cursor position", category: "cursor-movement" },
  { seq: "\\x1b[u", name: "RCP", description: "Restore cursor position", category: "cursor-movement" },

  // Cursor Visibility
  { seq: "\\x1b[?25h", name: "DECTCEM", description: "Show cursor", category: "cursor-visibility" },
  { seq: "\\x1b[?25l", name: "DECTCEM", description: "Hide cursor", category: "cursor-visibility" },
  { seq: "\\x1b[0 q", name: "DECSCUSR", description: "Default cursor shape", category: "cursor-visibility" },
  { seq: "\\x1b[1 q", name: "DECSCUSR", description: "Blinking block cursor", category: "cursor-visibility" },
  { seq: "\\x1b[2 q", name: "DECSCUSR", description: "Steady block cursor", category: "cursor-visibility" },
  { seq: "\\x1b[3 q", name: "DECSCUSR", description: "Blinking underline cursor", category: "cursor-visibility" },
  { seq: "\\x1b[4 q", name: "DECSCUSR", description: "Steady underline cursor", category: "cursor-visibility" },
  { seq: "\\x1b[5 q", name: "DECSCUSR", description: "Blinking bar cursor", category: "cursor-visibility" },
  { seq: "\\x1b[6 q", name: "DECSCUSR", description: "Steady bar cursor", category: "cursor-visibility" },

  // Erase
  { seq: "\\x1b[J", name: "ED", description: "Erase from cursor to end of screen", category: "erase" },
  { seq: "\\x1b[0J", name: "ED", description: "Erase from cursor to end of screen", category: "erase" },
  { seq: "\\x1b[1J", name: "ED", description: "Erase from cursor to beginning of screen", category: "erase" },
  { seq: "\\x1b[2J", name: "ED", description: "Erase entire screen", category: "erase" },
  { seq: "\\x1b[3J", name: "ED", description: "Erase screen and scrollback buffer", category: "erase" },
  { seq: "\\x1b[K", name: "EL", description: "Erase from cursor to end of line", category: "erase" },
  { seq: "\\x1b[0K", name: "EL", description: "Erase from cursor to end of line", category: "erase" },
  { seq: "\\x1b[1K", name: "EL", description: "Erase from cursor to beginning of line", category: "erase" },
  { seq: "\\x1b[2K", name: "EL", description: "Erase entire line", category: "erase" },

  // Color & Style
  { seq: "\\x1b[0m", name: "SGR", description: "Reset all styles", category: "color-style" },
  { seq: "\\x1b[1m", name: "SGR", description: "Bold", category: "color-style" },
  { seq: "\\x1b[2m", name: "SGR", description: "Dim (faint)", category: "color-style" },
  { seq: "\\x1b[3m", name: "SGR", description: "Italic", category: "color-style" },
  { seq: "\\x1b[4m", name: "SGR", description: "Underline", category: "color-style" },
  { seq: "\\x1b[7m", name: "SGR", description: "Reverse (swap foreground/background)", category: "color-style" },
  { seq: "\\x1b[8m", name: "SGR", description: "Hidden (invisible)", category: "color-style" },
  { seq: "\\x1b[9m", name: "SGR", description: "Strikethrough", category: "color-style" },
  { seq: "\\x1b[22m", name: "SGR", description: "Normal intensity (not bold, not dim)", category: "color-style" },
  { seq: "\\x1b[23m", name: "SGR", description: "Not italic", category: "color-style" },
  { seq: "\\x1b[24m", name: "SGR", description: "Not underlined", category: "color-style" },
  { seq: "\\x1b[27m", name: "SGR", description: "Not reversed", category: "color-style" },
  { seq: "\\x1b[29m", name: "SGR", description: "Not strikethrough", category: "color-style" },
  { seq: "\\x1b[30-37m", name: "SGR", description: "Set foreground color (standard 8 colors)", category: "color-style" },
  { seq: "\\x1b[38;5;{n}m", name: "SGR", description: "Set foreground to 256-color palette index n", category: "color-style" },
  { seq: "\\x1b[38;2;{r};{g};{b}m", name: "SGR", description: "Set foreground to RGB color", category: "color-style" },
  { seq: "\\x1b[39m", name: "SGR", description: "Default foreground color", category: "color-style" },
  { seq: "\\x1b[40-47m", name: "SGR", description: "Set background color (standard 8 colors)", category: "color-style" },
  { seq: "\\x1b[48;5;{n}m", name: "SGR", description: "Set background to 256-color palette index n", category: "color-style" },
  { seq: "\\x1b[48;2;{r};{g};{b}m", name: "SGR", description: "Set background to RGB color", category: "color-style" },
  { seq: "\\x1b[49m", name: "SGR", description: "Default background color", category: "color-style" },

  // Screen Buffer
  { seq: "\\x1b[?1049h", name: "xterm", description: "Enable alternate screen buffer", category: "screen-buffer" },
  { seq: "\\x1b[?1049l", name: "xterm", description: "Disable alternate screen buffer", category: "screen-buffer" },
  { seq: "\\x1b[?47h", name: "xterm", description: "Save screen and switch to alternate buffer", category: "screen-buffer" },
  { seq: "\\x1b[?47l", name: "xterm", description: "Restore screen from alternate buffer", category: "screen-buffer" },
];
