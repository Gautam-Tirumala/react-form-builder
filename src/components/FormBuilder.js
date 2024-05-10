import React, { useEffect, useState } from "react";
import NumberInput from "../subComponents/NumberInput";
import DatePickerInput from "../subComponents/DatePickerInput";
import FileUploadInput from "../subComponents/FileUploadInput";
import axios from "axios";

function FormBuilder() {
  const [formFields, setFormFields] = useState([
    {
        "type": "grid"
    },
    {
        "type": "col",
        "rowCode": 48,
        "Children": [
            {
                "type": "checkbox",
                "label": "Agree to Terms and conditions",
                "placeholder": "",
                "required": true
            },
            {
                "type": "textInput",
                "label": "Last Name",
                "placeholder": "Enter your Name",
                "required": false
            }
        ]
    }
]);

  const [formData, setFormData] = useState({});

  const [formName, setFormName] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const getDataFromDB = async () => {
      try {
        let res = await axios.get("http://localhost:3001/formdata");
        setFormFields(res.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    getDataFromDB();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with form submission
      console.log("Form submitted successfully!");
      console.log(formData);

      let res = await axios.get("http://localhost:3001/formName");
      let formName = res.data;


      const formData1 = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formData1.append(key, value);
    });


    formData1.append('formName', formName);

console.log("formData is", formData1);

  

      // let dataToSend = {
      //   formData: formData,
      //   formName: formName,
      // };

      console.log("dataToSend is", formData1);

      let result = await axios.post(
        "http://localhost:3001/submittedData",
        formData1
      );
      if (result.status === 200) {
        alert("Data added to perticular table");
      }
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    let validationErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.label]) {
        validationErrors[field.label] = `${field.label} is required`;
      }
      // Check if it's a "col" component and has children
      if (field.type === "col" && field.Children && field.Children.length > 0) {
        field.Children.forEach((childField) => {
          if (childField.required && !formData[childField.label]) {
            validationErrors[
              childField.label
            ] = `${childField.label} is required`;
          }
        });
      }
    });
    return validationErrors;
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const handleChangeForDate = (dateString, field) => {
    console.log("date receving is ", dateString);
    console.log("modified date receving is ", convert(dateString));
    const convertedDate = convert(dateString);
    setFormData({ ...formData, [field.label]: convertedDate });
  };

  const handleChangeForFiles = (file, field) => {
    console.log("date receving is ", file);
    file.arrayBuffer().then((buffer) => {
      console.log("Binary data:", buffer);
      setFormData({ ...formData, [field.label]: buffer });
    });
    
  };

  const handleChange = (e, field) => {
    const value = e.target.value;

    // Validation to check for special characters
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // if (hasSpecialChar) {
    //   setErrors({ ...errors, [field.label]: `${field.label} cannot contain special characters` });
    // } else {
    //   // Clear error message if no special character is found
    setErrors({ ...errors, [field.label]: "" });
    //   setFormData({ ...formData, [field.label]: value });
    // }
    setFormData({ ...formData, [field.label]: value });
  };

  const renderField = (field, index) => {
    

    switch (field.type) {
      case "textInput":
        return (
          <div className="flex items-center" key={index}>
            <input
              key={index}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder={field.placeholder}
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center" key={index}>
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              className="mr-2 leading-tight"
              onChange={(e) => handleChange(e, field)}
            />
            <label
              htmlFor={`checkbox-${index}`}
              className="text-sm text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );
      case "dropdown":
        return (
          <select
            key={index}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => handleChange(e, field)}
            value={formData[field.label] || ""}
          >
            <option value="" disabled>
              Select
            </option>
            {field.options.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            key={index}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="textArea"
            placeholder={field.placeholder}
            onChange={(e) => handleChange(e, field)}
          ></textarea>
        );
      case "numberinput":
        return (
          <NumberInput
            key={index}
            field={field}
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case "datepicker":
        return (
          <DatePickerInput
            key={index}
            field={field}
            formData={formData}
            handleChange={handleChangeForDate}
            errors={errors}
          />
        );
      case "fileupload":
        return (
          <FileUploadInput
            key={index}
            field={field}
            formData={formData}
            handleChange={handleChangeForFiles}
            errors={errors}
          />
        );
      case "col":
        return (
          <div key={index} className="flex">
            {field.Children &&
              field.Children.map((childField, childIndex) =>
                renderField(childField, childIndex)
              )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      {formFields.map((field, index) => {
        if (
          field.type === "col" &&
          field.rowCode &&
          field.Children &&
          field.Children.length > 0
        ) {

          const digitArray = field.rowCode.toString().split('').map(Number);
          console.log("DigitArray is ---------------> ", digitArray);
        
          return (
            <div key={index} className="row mb-4">
              {field.Children.map((childField, childIndex) => (
                <div key={childIndex} className={childIndex === 0 ? `col-${digitArray[0]}` : childIndex === 1 ? `col-${digitArray[1]}` : childIndex === 2 ? `col-${digitArray[2]}` : ""}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {childField.label}
                    {childField.required && (
                      <span className="text-red-500 pl-0.5">*</span>
                    )}
                  </label>

                  {renderField(childField, childIndex)}
                  {errors[childField.label] && (
                    <div className="text-red-500">
                      {errors[childField.label]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
        

        else if(
         
            field.type === "col" &&
            
            field.Children &&
            field.Children.length > 0
          ) {
            return (
              <div key={index} className="flex flex-row mb-4">
                {field.Children.map((childField, childIndex) => (
                  <div key={childIndex} className="flex-1 mr-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      {childField.label}
                      {childField.required && (
                        <span className="text-red-500 pl-0.5">*</span>
                      )}
                    </label>
  
                    {renderField(childField, childIndex)}
                    {errors[childField.label] && (
                      <div className="text-red-500">
                        {errors[childField.label]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
        
        
        
        else {
          return (
            <div key={index} className="mb-4">
              {field.type !== "col" && (
                <label className="block mb-1 font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 pl-0.5">*</span>
                  )}
                </label>
              )}
              {renderField(field, index)}
              {errors[field.label] && (
                <div className="text-red-500">{errors[field.label]}</div>
              )}
            </div>
          );
        }
      })}
      <button
        type="submit"
        className="block w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}

export default FormBuilder;
