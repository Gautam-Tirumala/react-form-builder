import React from "react";

export function Sidebar() {
  const components = [
    { text: "Heading", type: "header" },
    { text: "Row", type: "col" },
    { text: "Grid", type: "grid" },
    { text: "Text Input", type: "textInput" },
    { text: "Check Box", type: "checkbox" },
    { text: "Dropdown", type: "dropdown" },
    { text: "Textarea", type: "textarea" },
    { text: "Number input", type: "numberinput" },
    { text: "Date Picker", type: "datepicker" },
    { text: "File Upload", type: "fileupload" }
  ];

  return (
    <div className="w-1/5 min-h-full bg-gray-200 overflow-auto">
      {/* Components list */}
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Components</h2>
          {/* Mapping over components array to render buttons */}
          {components.map((component, index) => (
            <div key={index} className="mb-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("componentType", component.type);
                }}
              >
                {component.text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
