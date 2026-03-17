import { useRef, useState } from "react";
import { SequenceInput } from "./components/SequenceInput";
import { StructureGuide } from "./components/StructureGuide";
import { CheatSheet } from "./components/CheatSheet";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  function handleSelect(seq: string) {
    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const generators: Record<string, () => number> = {
      n: () => rand(1, 20),
      m: () => rand(1, 80),
      r: () => rand(0, 255),
      g: () => rand(0, 255),
      b: () => rand(0, 255),
    };
    setInput(seq.replace(/\{(\w+)\}/g, (_, key) => {
      const gen = generators[key];
      return gen ? String(gen()) : String(rand(1, 10));
    }));
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
