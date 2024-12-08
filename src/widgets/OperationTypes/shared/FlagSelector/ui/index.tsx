import React, { FC, useEffect } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";

export interface IFlag {
  id: number;
  name: string;
  points: number;
}

interface FlagSelectorProps {
  title: string;
  flags: IFlag[];
  selectedFlagsBitmask: number; 
  onToggle: (flagId: number) => void;
  operationIndex: number;
}

const FlagSelector: FC<FlagSelectorProps> = ({
  title,
  operationIndex,
  flags,
  selectedFlagsBitmask,
  onToggle,
}) => {
  // Helper function to check if a flag is selected
  const isSelected = (flagId: number) => (selectedFlagsBitmask & (1 << flagId)) !== 0;

  // Syncing URL with the selected flags bitmask on mount and when selectedFlagsBitmask changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Determine the flag parameter based on the operation type (Set or Clear)
    const flagParam = title === "Set Flags" ? `SetFlags${operationIndex}` : `ClearFlags${operationIndex}`;
    
    // Update the URL with the current selected flags
    if (selectedFlagsBitmask !== 0) {
      params.set(flagParam, selectedFlagsBitmask.toString());
    } else {
      params.delete(flagParam);  // If no flags are selected, remove the query param
    }
    
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [selectedFlagsBitmask, title, operationIndex]);

  // Calculate total points of selected flags
  const totalPoints = flags.reduce((sum, flag) => {
    return sum + (isSelected(flag.id) ? flag.points : 0);
  }, 0);


 

  // Update localStorage whenever the selected flags bitmask changes
  useEffect(() => {
    localStorage.setItem(`selectedFlagsBitmask${operationIndex}`, selectedFlagsBitmask.toString());
  }, [selectedFlagsBitmask, operationIndex]);

  return (
    <div className={s.section}>
      <h4 className={s.sectionTitle}>
        {title} <span className={s.optional}>(optional)</span>
      </h4>
      <div className={`tabs ${s.tabs}`}>
        <div className={`tabs-header ${s.tabsheader}`}>
          <div className={s.flagsContainer}>
            <div className={s.flags}>
              {flags.map((flag) => (
                <a
                  key={flag.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle(flag.id);  // Toggle flag selection when clicked
                  }}
                  className={`tabs-item ${s.tabsitem} condensed ${isSelected(flag.id) ? "selected" : ""}`}
                  style={{ cursor: "pointer", width: "140px", height: "90%", textDecoration: "none", flexWrap: "nowrap" }}
                  href="#"
                >
                  <span className="tabs-item-text" style={{ fontSize: "100%", border: "none" }}>
                    {flag.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        {selectedFlagsBitmask !== 0 && (
          <p>
            {flags.map((flag, index) => {
              return isSelected(flag.id) ? (
                <React.Fragment key={flag.id}>
                  {index > 0 && " + "}
                  <span>
                    {flag.name} ({flag.points})
                  </span>
                </React.Fragment>
              ) : null;
            })}
            {" = "}
            {totalPoints}
          </p>
        )}
        <p>
          Selected{" "}
          <a href="https://en.wikipedia.org/wiki/Bit_field" target="_blank" rel="noopener noreferrer">
            flags
          </a>{" "}
          mean to {title.includes("Set") ? "add" : "remove"} selected flags{" "}
          {title.includes("Set") ? "in addition to" : "from"} flags already present on the account.
        </p>
      </div>
    </div>
  );
};

export default FlagSelector;
