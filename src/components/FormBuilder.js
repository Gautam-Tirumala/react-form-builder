import React, { useEffect, useRef, useState } from "react";
import NumberInput from "../subComponents/NumberInput";
import DatePickerInput from "../subComponents/DatePickerInput";
import FileUploadInput from "../subComponents/FileUploadInput";
import axios from "axios";

function FormBuilder(props) {
  console.log("Props name in form builder ---> ",props.name);
  const [formFields, setFormFields] = useState([]);

  const [formData, setFormData] = useState({});

  const [formName, setFormName] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const getDataFromDB = async () => {
      try {
        let res;
        if(props.name === "student"){
          res = await axios.get("http://localhost:3001/formdata/student");
        }
        else if(props.name === "studentDropdown"){
          res = await axios.get("http://localhost:3001/formdata/studentDropdown");
        }
        else if(props.name === "dropdownExample"){
          res = await axios.get("http://localhost:3001/formdata/dropdownExample");
        }
        else{
          res = await axios.get("http://localhost:3001/formdata");
        }
       
        console.log("data --------->" , res.data);
        const fetchedFormFields = res.data;
        setFormFields(fetchedFormFields);

        console.log("Data inside the formFields initially ... ",fetchedFormFields);

        const updatedFormFields = await Promise.all(fetchedFormFields.map(async (component) => {
          

            if (component?.type === "col") {
              console.log("inside col");
              const updatedChildren = await Promise.all(component.Children.map(async (childComponent) => {
                  if (childComponent.type === "dropdown" && childComponent.link) {
                      try {
                          let response = await axios.get(childComponent.link);
                          const optionsArray = response.data;
                          return {
                              ...childComponent,
                              options: optionsArray,
                          };
                      } catch (error) {
                          console.error("Error fetching options data:", error);
                          return childComponent; 
                      }
                  } else {
                      return childComponent;
                  }
              }));
              console.log("updatedChildren ---> ",updatedChildren);
              component.Children = updatedChildren;
          }
          
          if (component?.type === "dropdown" && component.link) {
                try {
                    let response = await axios.get(component.link);
                    const optionsArray = response.data;
                    return {
                        ...component,
                        options: optionsArray,
                    };
                } catch (error) {
                    console.error("Error fetching options data:", error);
                    return component;
                }
             }
             else {
                return component;
            }
            
        }));

        setFormFields(updatedFormFields);
    } catch (error) {
        console.error("Error fetching form data:", error);
    }
};

    getDataFromDB();
  }, []);

 
  // useEffect(async()=>{
  //   const updatedFormFields = await Promise.all(formFields.map(async (component) => {
  //     if(component?.type === "dropdown" && component.link && /{[0-9]+}/.test(component.link)) {
  //       console.log();
  //       const indexPlaceholder = component.link.match(/{([0-9]+)}/)[1];
  //         const indexComponent = formFields[parseInt(indexPlaceholder)];
  //         console.log("indexComponent is", indexComponent);
  //         if (indexComponent) {
  //           let receivedIndex = formData[indexComponent.label];
  //           const link = component.link.replace(`{${indexPlaceholder}}`, receivedIndex);

  //           const response = await axios.get(link);
  //           const optionsArray = response.data;
  //         }
  //     }
  //   }))
   
  // },[])


  useEffect(()=>{
    console.log("formFields ", formFields);
    console.log("formData", formData);
  },[formFields])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with form submission
      console.log("Form submitted successfully!");
      console.log(formData);
      let formName=""
      if(props.name === "student"){
        formName = "form879";
      }
      else if(props.name === "studentDropdown"){
        formName = "form275";
      }
      else if(props.name === "dropdownExample"){
        formName = "form572";
      }
      else{
        let res = await axios.get("http://localhost:3001/formName");
      formName = res.data;
      }

     


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
      if (field?.required && !formData[field?.label]) {
        validationErrors[field?.label] = `${field?.label} is required`;
      }
      // Check if it's a "col" component and has children
      if (field?.type === "col" && field.Children && field.Children.length > 0) {
        field.Children.forEach((childField) => {
          if (childField?.required && !formData[childField?.label]) {
            validationErrors[
              childField?.label
            ] = `${childField?.label} is required`;
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
    setFormData({ ...formData, [field?.label]: convertedDate });
  };

  const handleChangeForFiles = (file, field) => {
    console.log("date receving is ", file);
    file.arrayBuffer().then((buffer) => {
      console.log("Binary data:", buffer);
      setFormData({ ...formData, [field?.label]: buffer });
    });
    
  };

  const handleChange = (e, field) => {
    const value = e.target.value;

    // Validation to check for special characters
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // if (hasSpecialChar) {
    //   setErrors({ ...errors, [field?.label]: `${field?.label} cannot contain special characters` });
    // } else {
    //   // Clear error message if no special character is found
    setErrors({ ...errors, [field?.label]: "" });
    //   setFormData({ ...formData, [field?.label]: value });
    // }
    setFormData({ ...formData, [field?.label]: value });
  };

  const handleChangeDropdown = async (e, field, index) => {
    const value = e.target.value;
    if (field.linkForNext) {
      console.log("field is ",field);
      let placeholders
        if(field.linkForNext.match(/{[0-9]+_[0-9]+}/g)?.length > 0){
          placeholders = field.linkForNext.match(/{[0-9]+_[0-9]+}/g);
          let updatedLink = field.linkForNext

          for (let i = 0; i < placeholders.length; i++) {
            let pIndex = placeholders[i];
            pIndex = pIndex.slice(1, -1).split('_').map(Number); // Split by underscore and convert to numbers
          
            // Assuming pIndex is an array containing [parentIndex, childIndex]
            let parentIndex = pIndex[0];
            let childIndex = pIndex[1];
          
            let lableForFormData = formFields[childIndex]?.label;
            let updateLinkValue = parentIndex === index ? value : formData[lableForFormData];
            updatedLink = updatedLink.replace(placeholders[i], updateLinkValue);
            console.log("updatedLink is", updatedLink);

            
          }
          const response = await axios.get(updatedLink);
const optionsArray = response.data;

if(field.ChildIndex && field.nextIndex){
  formFields[field.nextIndex].Children[field.ChildIndex].options = [...optionsArray];
}
else{
  formFields[field.nextIndex].options = [...optionsArray];
}


        // for(let i = 0;i<placeholders.length;i++){
        //   let pIndex = placeholders[i];
        //   pIndex = parseInt(pIndex.slice(1, -1));

        //   let lableForFormData = formFields[pIndex]?.label
        //   let updateLinkValue = pIndex === index ? value : formData[lableForFormData]
        //   updatedLink = updatedLink.replace(placeholders[i], updateLinkValue)
        // }
       
        // console.log("Final Updated Link: ", updatedLink);
        // console.log("to fill data ", field.nextIndex);

        // const response = await axios.get(updatedLink);
        // const optionsArray = response.data;
  
        // formFields[field.nextIndex].options = [...optionsArray]
        }
        else{
          placeholders = field.linkForNext.match(/{[0-9]+}/g);
        
        console.log("placeholders ",placeholders);

        let updatedLink = field.linkForNext

        for(let i = 0;i<placeholders.length;i++){
          let pIndex = placeholders[i];
          pIndex = parseInt(pIndex.slice(1, -1));

          let lableForFormData = formFields[pIndex]?.label
          let updateLinkValue = pIndex === index ? value : formData[lableForFormData]
          updatedLink = updatedLink.replace(placeholders[i], updateLinkValue)
        }
        // console.log("Final Updated Link: ", updatedLink);
        // console.log("to fill data ", field.nextIndex);

        const response = await axios.get(updatedLink);
        const optionsArray = response.data;
  
        formFields[field.nextIndex].options = [...optionsArray]
    }
  }
    setFormData({ ...formData, [field?.label]: value });
};

  const renderField = (field, index) => {
    
// console.log("field, index is ",field, index);
    switch (field?.type) {
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
              {field?.label}
            </label>
          </div>
        );
      case "dropdown":
        return (
          <select
            key={index}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => handleChangeDropdown(e, field, index)}
            value={formData[field?.label] || ""}
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
          field?.type === "col" &&
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
                    {childField?.label}
                    {childField?.required && (
                      <span className="text-red-500 pl-0.5">*</span>
                    )}
                  </label>

                  {renderField(childField, childIndex)}
                  {errors[childField?.label] && (
                    <div className="text-red-500">
                      {errors[childField?.label]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
        

        else if(
         
            field?.type === "col" &&
            
            field.Children &&
            field.Children.length > 0
          ) {
            return (
              <div key={index} className="flex flex-row mb-4">
                {field.Children.map((childField, childIndex) => (
                  <div key={childIndex} className="flex-1 mr-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      {childField?.label}
                      {childField?.required && (
                        <span className="text-red-500 pl-0.5">*</span>
                      )}
                    </label>
  
                    {renderField(childField, childIndex)}
                    {errors[childField?.label] && (
                      <div className="text-red-500">
                        {errors[childField?.label]}
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
              {field?.type !== "col" && (
                <label className="block mb-1 font-medium text-gray-700">
                  {field?.label}
                  {field?.required && (
                    <span className="text-red-500 pl-0.5">*</span>
                  )}
                </label>
              )}
              {renderField(field, index)}
              {errors[field?.label] && (
                <div className="text-red-500">{errors[field?.label]}</div>
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
