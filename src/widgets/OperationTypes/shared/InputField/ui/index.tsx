import React, { FC, ChangeEvent } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";

interface InputFieldProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => boolean;
  warningMessage?: string | JSX.Element;
  errorMessage?: string;
  isOptional?: boolean;
}

const InputField: FC<InputFieldProps> = ({
  title,
  placeholder,
  value,
  onChange,
  validate,
  warningMessage,
  errorMessage,
  isOptional = true,
}) => (
  <div className={s.section}>
    <h4 className={s.sectionTitle}>
      {title} {isOptional && <span className={s.optional}>(optional)</span>}
    </h4>
    <div>
      <input
        style={{ width: "812px" }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {validate && !validate(value) && errorMessage && (
        <p className="error">{errorMessage}</p>
      )}
      {warningMessage && <p className="warning">{warningMessage}</p>}
    </div>
  </div>
);

export default InputField;
