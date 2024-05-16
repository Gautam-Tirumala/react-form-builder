import React from 'react';

function TextareaComponent({ index, component, handleDeleteComponent, handleComponentChange }) {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-800">Text Area</h4>
      <div className="flex justify-end">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          onClick={() => handleDeleteComponent(index)}
        >
          Delete
        </button>
      </div>
      <label
        htmlFor={`textarea-label-${index}`}
        className="block text-gray-700"
      >
        Label:
      </label>
      <input
        type="text"
        id={`textarea-label-${index}`}
        value={component.label}
        onChange={(e) =>
          handleComponentChange(index, "label", e.target.value)
        }
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
      />
      <label
        htmlFor={`textarea-placeholder-${index}`}
        className="block text-gray-700 mt-2"
      >
        Placeholder:
      </label>
      <input
        type="text"
        id={`textarea-placeholder-${index}`}
        value={component.placeholder}
        onChange={(e) =>
          handleComponentChange(index, "placeholder", e.target.value)
        }
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
      />
      <div className="mt-2 flex items-center">
        <input
          type="checkbox"
          id={`required-checkbox-${index}`}
          checked={component.required}
          onChange={(e) =>
            handleComponentChange(index, "required", e.target.checked)
          }
          className="mr-2"
        />
        <label
          htmlFor={`required-checkbox-${index}`}
          className="text-gray-700"
        >
          Required
        </label>
      </div>
    </div>
  );
}

export default TextareaComponent;
