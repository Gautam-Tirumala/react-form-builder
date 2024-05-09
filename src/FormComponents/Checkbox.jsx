import React, { useState } from "react";



function Checkbox({ onSave }) {
    const [label, setLabel] = useState("");
  
    const handleSave = () => {
      onSave(label);
    };
  
    return (
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <input
          type="text"
          placeholder="Enter your label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border rounded p-2"
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
  