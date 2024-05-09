import React, { useState } from "react";


export function Sidebar() {
  return (
    <div className="w-1/5 min-h-full bg-gray-200 overflow-auto">
      {/* Components list */}
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Components</h2>
          {/* Button to drag the text input component */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "header");
            }}
          >
            Heading
          </button>
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "col");
            }}
          >
            Row
          </button>
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "grid");
            }}
          >
            Grid
          </button>
        </div>


        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "textInput");
            }}
          >
            Text Input
          </button>
        </div>
        {/* Checkbox component */}

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "checkbox");
            }}
          >
            Check Box
          </button>
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "dropdown");
            }}
          >
            Dropdown
          </button>
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "textarea");
            }}
          >
            Textarea
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "numberinput");
            }}
          >
            Number input
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "datepicker");
            }}
          >
            Date Picker
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("componentType", "fileupload");
            }}
          >
            File Upload
          </button>
        </div>
      </div>
    </div>
  );
}

