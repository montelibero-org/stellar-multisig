"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/shared/styles/dropdown/index.scss";

interface BaseDropdownProps<T> {
  options: T[];          // Options to display in the dropdown
  placeholder: string;   // Placeholder text when no option is selected
  multiSelect: boolean;  // Flag to indicate if multiple selections are allowed
}

interface SingleSelectProps<T> extends BaseDropdownProps<T> {
  multiSelect: false;                   // Must be false for single select
  onSelect: (selected: T) => void;      // Callback when an option is selected
  selectedOption?: T;                   // Currently selected option
}

interface MultiSelectProps<T> extends BaseDropdownProps<T> {
  multiSelect: true;                    // Must be true for multi-select
  onSelect: (selected: T[]) => void;    // Callback when options are selected
  selectedOptions?: T[];                // Currently selected options
}

type DropdownProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;

const Dropdown = <T extends string | number>(props: DropdownProps<T>) => {
  const { options, placeholder } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option click based on multiSelect mode
  const handleOptionClick = (option: T) => {
    if (props.multiSelect) {
      // Multi-select mode logic
      const selectedOptions = props.selectedOptions || [];
      const isSelected = selectedOptions.includes(option);
      const newSelectedOptions = isSelected
        ? selectedOptions.filter((item: T) => item !== option) // Remove if already selected
        : [...selectedOptions, option];                       // Add if not selected
      props.onSelect(newSelectedOptions);
    } else {
      // Single-select mode logic
      props.onSelect(option);
      setIsOpen(false); // Close dropdown after selection
    }
  };

  // Determine if an option is selected
  const isOptionSelected = (option: T): boolean => {
    if (props.multiSelect) {
      return props.selectedOptions?.includes(option) || false;
    } else {
      return props.selectedOption === option;
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Dropdown header that toggles the menu */}
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <div style={{ color: "var(--color-primary)" }}>
          <span className="nowrap">{placeholder}</span>
        </div>
      </div>
      {/* Dropdown menu displaying options */}
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={String(option)} // Convert option to string for key
              className={`dropdown-item ${
                isOptionSelected(option) ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {String(option)} {/* Display the option */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
