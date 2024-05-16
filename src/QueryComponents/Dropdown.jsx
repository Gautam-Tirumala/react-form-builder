import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dropdown = ({ item,handleChange,setAllData }) => {
  console.log("item in dropdown is", item);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/tables/${item}/fields`);
        const fields = response.data;
        const newOptions = fields.map(field => ({ value: field, label: field }));
        setOptions(newOptions);

        setAllData(prevOptions => [...prevOptions,...newOptions])
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    if (item) {
      fetchOptions();
    }
  }, [item]);



  return (
    <div className="dropdown inline-block relative flex-1">
    <label htmlFor={`dropdown-${item}`} className="mr-2 text-dark">{item}</label>
    <select
      name={item}
      id={`dropdown-${item}`}
      onChange={handleChange}
      className="custom-select border border-secondary px-4 py-2 rounded shadow-sm"
    >
      <option value="">Select an option</option>
      {options.map(option => (
        <option key={option.value} value={option.value} name={item}>{option.label}</option>
      ))}
    </select>
    {/* <input
        type="text"
        name = "relation"
        placeholder="Enter relation table name"
        // value={inputValue}
        // onChange={handleInputChange}
        className="border border-secondary px-4 py-2 rounded shadow-sm ml-2"
      /> */}
  </div>


  

  );
};

export default Dropdown;
