// InputField.jsx
import React from "react";

export default function InputField({ label, type, name, id, value, onChange, className, placeholder }) {
  return (
    <div className={`${name}Group`}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
    </div>
  );
}
