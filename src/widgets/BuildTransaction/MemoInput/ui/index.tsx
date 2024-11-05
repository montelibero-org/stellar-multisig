"use client";

import { FC, useState, useEffect } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";


const MemoInput: FC = () => {
  const { tx, setMemo, selectedMemoType, setSelectedMemoType } = useStore(useShallow((state) => ({
    tx: state.tx,
    setMemo: state.setMemo,
    selectedMemoType: state.selectedMemoType,
    setSelectedMemoType: state.setSelectedMemoType, 
  })));

  const memoTypes = ["None", "Text", "ID", "Hash", "Return"];
  const [memoInput, setMemoInput] = useState<string>("");

  useEffect(() => {
    
    if (!tx.tx.memo) {
      setMemo("none");
      setSelectedMemoType("None");
    } else if (typeof tx.tx.memo !== "string") {
      const memoValue = Object.values(tx.tx.memo)[0] as string;
      setMemoInput(memoValue);
    }
  }, [tx.tx.memo]);

  const handleMemoTypeChange = (type: string) => {
    setSelectedMemoType(type);
    if (type === "None") {
      setMemo("none"); 
      setMemoInput("");
    } else {
      const memoValue = {
        [type.toLowerCase()]: memoInput,
      }; 
      setMemo(memoValue); 
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("selectedMemoType", selectedMemoType.toString());
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [selectedMemoType]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (typeof tx.tx.memo === "object") {
      const memoValue = Object.values(tx.tx.memo)[0];
      params.set("memoText", memoValue || "");
    } else {
      params.set("memoText", tx.tx.memo.toString());
    }
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [tx.tx.memo]);
  return (
    <div>
      <h4>Memo</h4>
      <div className="tabs" style={{ display: "flex", justifyContent: "start", width: "100%" }}>
        <div className="tabs-header">
          {memoTypes.map((type) => (
            <a
              className={`line tabs-item condensed ${selectedMemoType === type ? "selected" : ""}`}
              href="#"
              key={type}
              onClick={(event) => {
                event.preventDefault();
                handleMemoTypeChange(type);
              }}
              style={{ width: "50px" }}
            >
              <span className="tabs-item-text">{type}</span>
            </a>
          ))}
        </div>
      </div>

      
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
            const memoKey = Object.keys(tx.tx.memo)[0];
            setMemo({ [memoKey]: e.target.value });
          }}
        />
      )}
    </div>
  );
};

export default MemoInput;