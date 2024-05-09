import React, { useState } from "react";


function TextInput({ onSave }) {
    const [placeholder, setPlaceholder] = useState("");
  
    const handleSave = () => {
      onSave(placeholder);
    };
  
    return (
      <div>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 m-2"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Enter your placeholder value"
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    );
  }