import { type ReactNode } from "react";
import { nameFullForms } from "../data/sequences";

/** Highlight letters in fullForm that correspond to the abbreviation */
function highlightAbbreviation(abbr: string, fullForm: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let abbrIdx = 0;

  for (let i = 0; i < fullForm.length; i++) {
    const ch = fullForm[i]!;
    if (
      abbrIdx < abbr.length &&
      ch.toUpperCase() === abbr[abbrIdx]!.toUpperCase()
    ) {
      parts.push(<strong key={i}>{ch}</strong>);
      abbrIdx++;
    } else {
      parts.push(ch);
    }
  }
  return parts;
}

export function NameWithTooltip({ name }: { name: string }) {
  const fullForm = nameFullForms[name];

  if (!fullForm) {
    return <span>{name}</span>;
  }

  return (
    <span className="name-tooltip-wrap">
      {name}
      <span className="name-tooltip">
        {highlightAbbreviation(name, fullForm)}
      </span>
    </span>
  );
}
