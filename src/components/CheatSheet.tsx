import { useState } from "react";
import {
  sequences,
  categoryLabels,
  type Category,
} from "../data/sequences";
import { NameWithTooltip } from "./NameWithTooltip";

export function CheatSheet({
  onSelect,
}: {
  onSelect: (seq: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = sequences.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.seq.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      categoryLabels[s.category].toLowerCase().includes(q)
    );
  });

  const grouped = new Map<Category, typeof filtered>();
  for (const s of filtered) {
    const list = grouped.get(s.category) ?? [];
    list.push(s);
    grouped.set(s.category, list);
  }

  return (
    <div className="cheat-sheet">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search sequences... (e.g. cursor, color, erase)"
        className="search-input"
        spellCheck={false}
      />
      {Array.from(grouped.entries()).map(([cat, items]) => (
        <div key={cat} className="category-group">
          <h2>{categoryLabels[cat]}</h2>
          <table className="ref-table">
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s, i) => (
                <tr
                  key={i}
                  className="clickable-row"
                  onClick={() => onSelect(s.seq)}
                  title="Click to parse"
                >
                  <td className="seq-cell">{s.seq}</td>
                  <td className="name-cell"><NameWithTooltip name={s.name} /></td>
                  <td>{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="no-results">No matching sequences found.</p>
      )}
    </div>
  );
}
