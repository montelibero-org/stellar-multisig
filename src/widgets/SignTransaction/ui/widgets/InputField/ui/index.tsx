"use client";

import { FC, useEffect, useState } from "react";
import { localSignature } from "@/views/SignTransaction/page";

interface InputFieldProps {
  label?: string;
  value: string;
  readOnly?: boolean;
  textarea?: boolean;
  flex?: boolean;
  setValue?: (value: string, index?: number) => void;
  placeholder?: string;
  isDeleting?: boolean;
  localSignatures?: localSignature;
  setLocalSignatures?: (value: localSignature) => void;
  validate?: (secretKey: string) => string;
  index?: number;
}

const InputField: FC<InputFieldProps> = ({
  label,
  value,
  readOnly = true,
  textarea = false,
  flex = false,
  setValue,
  placeholder = "",
  isDeleting = false,
  localSignatures,
  setLocalSignatures,
  validate,
  index,
}) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (validate) {
      setError(validate(value));
    }
  }, [value, validate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue?.(e.target.value);
  };

  const handleDelete = () => {
    if (setLocalSignatures && localSignatures) {
      const newLocalSignatures: localSignature = localSignatures.filter((_, i) => i !== index);
      setLocalSignatures(newLocalSignatures);
    }
  };

  const commonStyles = {
    width: "100%",
    border: "1px solid #535759",
  };

  return (
    <div style={{ flex: flex ? 1 : "auto" }}>
      {label && <h3>{label}</h3>}
      {textarea ? (
        <>
          <textarea
            value={value}
            placeholder={placeholder}
            style={{ ...commonStyles, height: "130px" }}
            readOnly={readOnly}
            onChange={!readOnly ? handleChange : undefined}
          />
          {isDeleting && setLocalSignatures && localSignatures && (
            <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <input
            value={value}
            placeholder={placeholder}
            style={{ ...commonStyles, maxHeight: "40px" }}
            readOnly={readOnly}
            onChange={!readOnly ? handleChange : undefined}
          />
          {isDeleting && setLocalSignatures && localSignatures && (
            <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </>
      )}
    </div>
  );
};

export default InputField;
