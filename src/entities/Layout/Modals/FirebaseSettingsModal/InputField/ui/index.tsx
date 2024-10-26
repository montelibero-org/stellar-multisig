import React, { FC } from "react";

interface Props {
  title: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const InputField: FC<Props> = ({ title, placeholder, value, setValue }) => {
  return (
    <div>
      <p>{title}</p>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
      {value.length > 64 && (
        <p className="error" style={{ padding: "3px 0 2px 0" }}>
          <center>Too long</center>
        </p>
      )}
    </div>
  );
};

export default InputField;
