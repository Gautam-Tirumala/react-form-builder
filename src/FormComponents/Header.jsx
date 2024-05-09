import React, { useState } from "react";

// Heading component
function Heading({ onSave }) {
  const [heading, setHeading] = useState("");

  const handleSave = () => {
    onSave(heading);
  };

  return (
    <div>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Enter your heading"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
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