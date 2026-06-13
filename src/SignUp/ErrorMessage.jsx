// ErrorMessage.jsx
import React from "react";

export default function ErrorMessage({ errorMessage, className }) {
  if (!errorMessage || errorMessage.length === 0) return null;
  return <p className={className}>{errorMessage[0]}</p>;
}