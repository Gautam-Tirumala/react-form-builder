import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerInput({ field, formData, handleChange }) {
  return (
    <div className="">
      <DatePicker
        selected={formData[field.label] || null}
        onChange={(date) => {
          
          handleChange(date, field);
        }}
        placeholderText="dd-MM-yyyy"
        dateFormat="dd-MM-yyyy"
        showYearDropdown
        className="w-full px-0.5 border rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

export default DatePickerInput;
