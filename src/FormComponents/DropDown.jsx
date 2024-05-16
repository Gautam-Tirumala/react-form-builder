import React from 'react';

function DropdownComponent({
  index,
  component,
  handleDeleteComponent,
  handleComponentChange,
  handleOptionsChange,
  handleLinkChange,
  handleLinkChangeForNext,
  getDataOfOptionsFromTheLink
}) {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-800">Drop Down</h4>
      <div className="flex justify-end">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          onClick={() => handleDeleteComponent(index)}
        >
          Delete
        </button>
      </div>
      <label
        htmlFor={`dropdown-label-${index}`}
        className="block text-gray-700"
      >
        Label:
      </label>
      <input
        type="text"
        id={`dropdown-label-${index}`}
        value={component.label}
        onChange={(e) =>
          handleComponentChange(index, "label", e.target.value)
        }
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
      />
      <p className="text-gray-700 mt-2">
        Enter Options separated by commas (,)
      </p>
      <input
        type="text"
        placeholder="Option 1, Option 2, ..."
        value={component.options.join(", ")}
        onChange={(e) => handleOptionsChange(index, e.target.value)}
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
      />
      <p className="text-gray-700 mt-2">Provide a link for this component</p>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="http://......"
          value={component.link}
          onChange={(e) => handleLinkChange(index, e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
        />
        <button
          onClick={() => getDataOfOptionsFromTheLink(index)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Get
        </button>
      </div>
      <p className="text-gray-700 mt-2">
        Provide a link including index Number in curly braces
      </p>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="http://......"
          value={component.linkForNext}
          onChange={(e) => handleLinkChangeForNext(index, "linkForNext", e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
        />
        <input
          type="text"
          placeholder="Index"
          value={component.nextIndex}
          onChange={(e) => handleLinkChangeForNext(index, "nextIndex", e.target.value)}
          className="m-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
        />
      </div>
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

export default DropdownComponent;
