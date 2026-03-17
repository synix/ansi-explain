import { parse, type ParseResult } from "../parser/parse";

export function SequenceInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  let result: ParseResult | null = null;
  let error = false;

  if (value.trim()) {
    result = parse(value);
    if (!result && value.trim().length > 1) {
      error = true;
    }
  }

  return (
    <div className="sequence-input">
      <label htmlFor="seq-input">Paste an ANSI escape sequence</label>
      <input
        id="seq-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"e.g. \\x1b[?25l  \\033[2J  \\e[1;31m"}
        spellCheck={false}
        autoComplete="off"
      />
      {error && (
        <p className="error">Could not parse. Supports CSI sequences (ESC [ ...).</p>
      )}
      {result && (
        <div className="parse-result">
          <table className="char-table">
            <thead>
              <tr>
                <th>Character</th>
                <th>Hex</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {result.chars.map((ch, i) => (
                <tr key={i}>
                  <td className="char-cell">{ch.raw}</td>
                  <td className="hex-cell">{ch.hex}</td>
                  <td>{ch.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="summary">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
