import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerInput({ field, formData, handleChange, errors }) {
  return (
    <div className="">
      <DatePicker
        selected={formData[field.label] || null}
        onChange={(date) => {
          // date.setHours(0, 0, 0, 0);
          const dateString = date.toISOString().split('T')[0];
          handleChange(dateString, field);
        }}
        placeholderText={field.label}
        dateFormat="dd-MM-yyyy"
        showYearDropdown
        className="w-full px-4  border rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

export default DatePickerInput;
