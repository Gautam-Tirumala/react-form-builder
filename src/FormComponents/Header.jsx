import React from 'react';

function HeaderComponent({ index, component, handleDeleteComponent, handleComponentChange }) {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-800">Header</h4>
      <div className="flex justify-end">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          onClick={() => handleDeleteComponent(index)}
        >
          Delete
        </button>
      </div>
      <label
        htmlFor={`heading-input-${index}`}
        className="block text-gray-700"
      >
        Label:
      </label>
      <input
        type="text"
        id={`heading-input-${index}`}
        value={component.label}
        onChange={(e) =>
          handleComponentChange(index, "label", e.target.value)
        }
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
      />
    </div>
  );
}

export default HeaderComponent;
