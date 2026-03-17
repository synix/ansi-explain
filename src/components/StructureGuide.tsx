export function StructureGuide() {
  return (
    <div className="structure-guide">
      <h2>CSI Sequence Structure</h2>
      <div className="structure-diagram">
        <span className="part part-csi">ESC [</span>
        <span className="part part-prefix">?</span>
        <span className="part part-params">params</span>
        <span className="part part-intermediate">intermediate</span>
        <span className="part part-final">final</span>
      </div>
      <table className="structure-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Range</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="part-label part-csi">ESC [</td>
            <td>0x1B 0x5B</td>
            <td>CSI — Control Sequence Introducer. Starts every sequence.</td>
          </tr>
          <tr>
            <td className="part-label part-prefix">?</td>
            <td>0x3C–0x3F</td>
            <td>Private mode prefix (optional). <code>?</code> marks DEC private modes. Also <code>&gt;</code> <code>=</code> <code>&lt;</code>.</td>
          </tr>
          <tr>
            <td className="part-label part-params">params</td>
            <td>0x30–0x3B</td>
            <td>Parameter bytes. Digits and <code>;</code> separator — e.g. <code>25</code>, <code>5;10</code>.</td>
          </tr>
          <tr>
            <td className="part-label part-intermediate">intermediate</td>
            <td>0x20–0x2F</td>
            <td>Intermediate bytes (rare). E.g. space in <code>\x1b[2 q</code>.</td>
          </tr>
          <tr>
            <td className="part-label part-final">final</td>
            <td>0x40–0x7E</td>
            <td>Final byte. Determines the function. See common ones below.</td>
          </tr>
        </tbody>
      </table>

      <h3>Common Final Bytes</h3>
      <table className="structure-table">
        <thead>
          <tr>
            <th>Byte</th>
            <th>Name</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="char-cell">A</td><td>CUU</td><td>Cursor Up</td></tr>
          <tr><td className="char-cell">B</td><td>CUD</td><td>Cursor Down</td></tr>
          <tr><td className="char-cell">C</td><td>CUF</td><td>Cursor Forward</td></tr>
          <tr><td className="char-cell">D</td><td>CUB</td><td>Cursor Back</td></tr>
          <tr><td className="char-cell">H</td><td>CUP</td><td>Cursor Position</td></tr>
          <tr><td className="char-cell">J</td><td>ED</td><td>Erase in Display</td></tr>
          <tr><td className="char-cell">K</td><td>EL</td><td>Erase in Line</td></tr>
          <tr><td className="char-cell">h</td><td>SM</td><td>Set Mode — enable (high = on)</td></tr>
          <tr><td className="char-cell">l</td><td>RM</td><td>Reset Mode — disable (low = off)</td></tr>
          <tr><td className="char-cell">m</td><td>SGR</td><td>Select Graphic Rendition (color/style)</td></tr>
          <tr><td className="char-cell">q</td><td>DECSCUSR</td><td>Set Cursor Style</td></tr>
          <tr><td className="char-cell">s</td><td>SCP</td><td>Save Cursor Position</td></tr>
          <tr><td className="char-cell">u</td><td>RCP</td><td>Restore Cursor Position</td></tr>
        </tbody>
      </table>

      <p className="structure-note">
        Defined in <a href="https://ecma-international.org/publications-and-standards/standards/ecma-48/" target="_blank" rel="noopener">ECMA-48</a>.
        Private modes (<code>?</code>) defined by <a href="https://vt100.net/docs/vt220-rm/" target="_blank" rel="noopener">DEC</a> and <a href="https://invisible-island.net/xterm/ctlseqs/ctlseqs.html" target="_blank" rel="noopener">xterm</a>.
      </p>
    </div>
  );
}
