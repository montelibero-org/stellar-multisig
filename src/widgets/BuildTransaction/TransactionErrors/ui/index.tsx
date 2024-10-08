"use client";

import { FC } from "react";

interface Props {
  errors: string[];
}

const TransactionErrors: FC<Props> = ({ errors }) => (
  <div style={{marginTop: "20px"}} className="segment blank">
    <h2>Transaction Building Errors:</h2>
    <ul>
      {errors.map((error, index) => (
        <li key={index}>{`- ${error}`}</li>
      ))}
    </ul>
  </div>
);

export default TransactionErrors;
