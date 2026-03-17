import { useRef, useState } from "react";
import { SequenceInput } from "./components/SequenceInput";
import { StructureGuide } from "./components/StructureGuide";
import { CheatSheet } from "./components/CheatSheet";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  function handleSelect(seq: string) {
    setInput(seq);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="app">
      <header ref={topRef}>
        <h1>ansi-explain</h1>
        <p className="subtitle">Interactive ANSI escape sequence decoder</p>
      </header>
      <main>
        <SequenceInput value={input} onChange={setInput} />
        <StructureGuide />
        <CheatSheet onSelect={handleSelect} />
      </main>
    </div>
  );
}
