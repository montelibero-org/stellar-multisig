"use client";

import { FC, useState, useEffect } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

const MemoInput: FC = () => {
  const { tx, setMemo } = useStore(useShallow((state) => state));

  const memoTypes = ["None", "Text", "ID", "Hash", "Return"];

  const [memoInput, setMemoInput] = useState<string>("");
  const [selectedMemoType, setSelectedMemoType] = useState<string>("");

  useEffect(() => {
    if (tx.tx.memo && typeof tx.tx.memo !== "string") {
      const memoValue = Object.values(tx.tx.memo)[0];
      setMemoInput(memoValue);
    } else {
      setMemoInput("");
    }
  }, [tx.tx.memo]);

  const handleMemoTypeChange = (type: string) => {
    if (type === "None") {
      setMemo("none");
    } else {
      setMemo({ [type.toLowerCase()]: memoInput });
    }
  };

  return (
    <div>
      <h4>Memo</h4>
      {memoTypes.map((type) => (
        <button
          key={type}
          className={`button ${selectedMemoType === type && "disabled"}`}
          onClick={() => {
            handleMemoTypeChange(type);
            setSelectedMemoType(type);
          }}
          disabled={selectedMemoType === type}
        >
          {type}
        </button>
      ))}
      {tx.tx.memo !== "none" && (
        <input
          placeholder={
            typeof tx.tx.memo === "object" && "text" in tx.tx.memo
              ? "UTF-8 string of up to 28 bytes"
              : typeof tx.tx.memo === "object" && "id" in tx.tx.memo
              ? "Unsigned 64-bit integer"
              : "32-byte hash in hexadecimal format (64 [0-9a-f] characters)"
          }
          value={memoInput}
          onChange={(e) => {
            setMemoInput(e.target.value);
            setMemo({ [Object.keys(tx.tx.memo)[0]]: e.target.value });
          }}
        />
      )}
    </div>
  );
};

export default MemoInput;
