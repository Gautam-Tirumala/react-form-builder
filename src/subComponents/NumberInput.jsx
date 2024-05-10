import React from "react";

function NumberInput({ field, formData, handleChange, errors }) {
  return (
    <div className="">
      <input
      
        type="number"
        className="w-full px-3  border rounded-md focus:outline-none focus:border-blue-500"
        placeholder={field.label}
        onChange={(e) => handleChange(e, field)}
        value={formData[field.label] || ""}
      />
    </div>
  );
}

export default NumberInput;
