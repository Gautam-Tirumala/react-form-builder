import React, { Children, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import axios from "axios";
import GridComponent from "./GridComponent";

export function Canvas() {
  const [formComponents, setFormComponents] = useState([]);
  const [data, setData] = useState([]);

  const [fomrNumber, setFomrNumber] = useState(101);

  const canvasRef = React.useRef(null);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(formComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormComponents(items);
  }

  useEffect(() => {
    console.log("Form components are ", formComponents);
  }, [formComponents, data]);

  const getInitialState = (componentType) => {
    switch (componentType) {
      case "textInput":
        return { label: "", placeholder: "", required: false };
      case "header":
        return { label: "" };
      case "textarea":
        return { label: "", placeholder: "", required: false };
      case "checkbox":
        return { label: "", placeholder: "", required: false };
      case "dropdown":
        return { label: "", options: [], link: "", required: false };
      case "numberinput":
        return { label: "", required: false };
      case "datepicker":
        return { label: "", required: false };
      case "fileupload":
        return { label: "", required: false };
      case "col":
        // Initialize an array to hold three components
        return {
          Children: [],
        };
      default:
        return {};
    }
  };

  const isComponentNotAllowed = (componentType) => {
    const allowedTypes = ['col', 'grid']; 
    return allowedTypes.includes(componentType);
  };

  const handleDropForCol = (e, colIndex, boxIndex) => {
    console.log("handleDropForCol called ");
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData("componentType");

    if (isComponentNotAllowed(componentType)) {
      alert("This component cannot be dropped here.");
      return;
    }

    let initialState = {};
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      const colComponent = updatedComponents[colIndex];
      initialState = getInitialState(componentType);

      colComponent.Children.push({ type: componentType, ...initialState });

      return updatedComponents;
    });
    // }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleDrop called");
    // const hoveredDiv =
    // .id
    const componentType = e.dataTransfer.getData("componentType");
    let initialState = {};

    initialState = getInitialState(componentType);
    setFormComponents((prevFormComponents) => [
      ...prevFormComponents,
      { type: componentType, ...initialState },
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const threshold = 50; // Adjust as needed
    const canvas = canvasRef.current;

    // Get mouse position relative to canvas
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    // Log mouse coordinates

    // Calculate halfway point of canvas height
    const halfwayHeight = canvas.offsetHeight / 2;

    if (mouseY >= halfwayHeight) {
      canvas.scrollBy({
        top: 1000, // Scroll down by 100 pixels
        behavior: "smooth",
      });
    }
  };

  const handleFinalSubmit = async () => {
    let formNumber = Math.floor(Math.random() * 1000);
    const infoToSend = {
      form_name: `form${formNumber}`,
      created_by: "gautam7845",
      data: formComponents,
    };
    let result = await axios.post("http://localhost:3001/", infoToSend);
    if (result) {
      window.location.href = "http://localhost:3000/preview";
    }
  };

  const handleComponentChange = (index, property, value) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      updatedComponents[index] = {
        ...updatedComponents[index],
        [property]: value,
      };
      return updatedComponents;
    });
  };

  function isLink(text) {
    var urlPattern = new RegExp("https?://\\S+");
    return urlPattern.test(text);
  }

  const handleOptionsChange = (index, value) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      const optionsArray = value.split(",").map((option) => option.trim());
      updatedComponents[index] = {
        ...updatedComponents[index],
        options: optionsArray,
      };
      return updatedComponents;
    });
  };
  const handleLinkChange = (index, value) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      updatedComponents[index] = {
        ...updatedComponents[index],
        link: value.trim(),
      };
      return updatedComponents;
    });
  };
  const handleLinkNestedChange = (parentIndex, childIndex, value) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      const parentComponent = updatedComponents[parentIndex];
      const updatedChildComponents = [...parentComponent.Children];
      const updatedChildComponent = {
        ...updatedChildComponents[childIndex],
        link: value.trim(),
      };

      updatedChildComponents[childIndex] = updatedChildComponent;
      updatedComponents[parentIndex] = {
        ...parentComponent,
        options: updatedChildComponents,
      };

      return updatedComponents;
    });
  };

  const getDataOfOptionsFromTheLinkNested = (parentIndex, childIndex) => {
    axios
      .get("http://localhost:3001/optionsData")
      .then((response) => {
        const optionsArray = response.data;
        setFormComponents((prevFormComponents) => {
          const updatedComponents = [...prevFormComponents];
          const parentComponent = updatedComponents[parentIndex];
          const updatedChildComponents = [...parentComponent.Children];
          const updatedChildComponent = {
            ...updatedChildComponents[childIndex],
            options: optionsArray,
          };

          updatedChildComponents[childIndex] = updatedChildComponent;

          updatedComponents[parentIndex] = {
            ...parentComponent,
            Children: updatedChildComponents,
          };

          return updatedComponents;
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getDataOfOptionsFromTheLink = (index) => {
    axios
      .get("http://localhost:3001/optionsData")
      .then((response) => {
        const optionsArray = response.data;
        setFormComponents((prevFormComponents) => {
          const updatedComponents = [...prevFormComponents];
          updatedComponents[index] = {
            ...updatedComponents[index],
            options: optionsArray,
          };
          return updatedComponents;
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleNestedOptionsChange = (parentIndex, childIndex, value) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      const optionsArray = value.split(",").map((option) => option.trim());
      const parentComponent = updatedComponents[parentIndex];
      const updatedChildComponents = [...parentComponent.Children];

      const updatedChildComponent = {
        ...updatedChildComponents[childIndex],
        options: optionsArray,
      };
      updatedChildComponents[childIndex] = updatedChildComponent;
      updatedComponents[parentIndex] = {
        ...parentComponent,
        Children: updatedChildComponents,
      };
      return updatedComponents;
    });
  };

  const handleDeleteComponent = (index) => {
    setFormComponents((prevFormComponents) =>
      prevFormComponents.filter((_, i) => i !== index)
    );
  };

  const handleNestedDeleteComponent = (parentIndex, childIndex) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      // Remove the child component at the given index from the parent's Children array
      updatedComponents[parentIndex].Children.splice(childIndex, 1);
      return updatedComponents;
    });
  };

  const handleNestedComponentChange = (
    parentIndex,
    childIndex,
    property,
    value
  ) => {
    setFormComponents((prevFormComponents) => {
      const updatedComponents = [...prevFormComponents];
      updatedComponents[parentIndex].Children[childIndex] = {
        ...updatedComponents[parentIndex].Children[childIndex], // delete it from here
        [property]: value,
      };
      return updatedComponents;
    });
  };

  const removeGridAfterAddingCol = () => {
    console.log(
      "formComponents inside removeDridAfterAddingCol is",
      formComponents
    );

    const updatedComponents = formComponents.filter(
      (component) => component.type !== "grid"
    );

    console.log("updatedComponents is", updatedComponents);
  };

  const handleColumsSelected = (row, rowIndex) => {
    console.log("row received is ", row);
    const initialState = getInitialState("col");
    const rowCode = row[0].uid;
    console.log("initialState is ", initialState);
    console.log(" rowCode is   ", rowCode);
    const newComponent = { type: "col", rowCode: rowCode, ...initialState };
    const updatedComponents = [...formComponents, newComponent];
    // setFormComponents([...formComponents,{type : 'col', rowCode : rowCode, ...initialState} ])

    const filteredComponents = updatedComponents.filter(
      (component) => component.type !== "grid"
    );

    setFormComponents(filteredComponents);

    // console.log("Form components after adding col",formComponents);
    // remove grid
    // const updatedComponents = formComponents.filter(component => component.type !== 'grid');
    // removeGridAfterAddingCol();
    // setFormComponents(updatedComponents);
    // console.log("Form components after removing col",formComponents);
  };

  return (
    <div
      ref={canvasRef}
      className="w-4/5 h-full overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-4 ">
        <h2 className="text-lg font-bold mb-2">Form Preview</h2>

        {formComponents.map((component, index) => (
          <div key={index} className="mb-2">
            {component.type === "grid" && (
              <div className="mt-4">
                <div className=" flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    Delete
                  </button>
                </div>
                <GridComponent handleColumsSelected={handleColumsSelected} />
              </div>
            )}

            {component.type === "header" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">Header</h4>
                <div className=" flex justify-end ">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    X
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
            )}

            {component.type === "textInput" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 ">
                  Text Input
                </h4>
                <div className=" flex justify-end ">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    Delete
                  </button>
                </div>

                <label
                  htmlFor={`text-label-${index}`}
                  className="block text-gray-700"
                >
                  Label:
                </label>
                <input
                  type="text"
                  id={`text-label-${index}`}
                  value={component.label}
                  onChange={(e) =>
                    handleComponentChange(index, "label", e.target.value)
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                />
                <label
                  htmlFor={`text-placeholder-${index}`}
                  className="block text-gray-700 mt-2"
                >
                  Placeholder:
                </label>
                <input
                  type="text"
                  id={`text-placeholder-${index}`}
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
            )}

            {component.type === "textarea" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 ">
                  Text Area
                </h4>
                <div className=" flex justify-end ">
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
            )}
           {component.type === "radio" && (
  <div className="mt-4">
    <h4 className="text-lg font-semibold text-gray-800">Radio Button</h4>
    <div className="flex justify-end">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        onClick={() => handleDeleteComponent(index)}
      >
        Delete
      </button>
    </div>
    <label htmlFor={`radio-label-${index}`} className="block text-gray-700">
      Label:
    </label>
    <input
      type="text"
      id={`radio-label-${index}`}
      value={component.label}
      onChange={(e) => handleComponentChange(index, "label", e.target.value)}
      className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
    />
    <div className="mt-2">
    <p className="text-gray-700 mt-2">
                  Enter Options separated by commas (,)
                </p>
                <input
                  type="text"
                  placeholder="Option 1, Option 2, ..."
                  value={component.options?.join(", ")}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                />
    </div>
  </div>
)}


            {component.type === "checkbox" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 ">
                  Checkbox
                </h4>
                <div className=" flex justify-end ">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    Delete
                  </button>
                </div>

                <label
                  htmlFor={`checkbox-label-${index}`}
                  className="block text-gray-700"
                >
                  Label:
                </label>
                <input
                  type="text"
                  id={`checkbox-label-${index}`}
                  value={component.label}
                  onChange={(e) =>
                    handleComponentChange(index, "label", e.target.value)
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
            )}

            {component.type === "dropdown" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 ">
                  Drop Down
                </h4>
                <div className=" flex justify-end ">
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
                <p className="text-gray-700 mt-2">provide a link</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="http://......"
                    value={component.link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                  />
                  <button
                    onClick={() => getDataOfOptionsFromTheLink(index)} // Assuming getData function is defined elsewhere
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    Get
                  </button>
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
            )}

            {/* This elements are for columns nested  */}

            {component.type === "col" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">Columns</h4>
                <h4 className="text-lg font-semibold text-gray-800">
                  Drag and drop{" "}
                  {component.rowCode
                    ? `${String(component.rowCode).length} elements into box rowCode ${component.rowCode}`
                    : "your elements into box"}
                </h4>
                <div
                  className="flex w-full"
                  onDrop={(e) => {
                    handleDropForCol(e, index, 4);
                  }}
                >
                  {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">Box</h2>  */}
                  <div className="border  w-full p-4 ">
                    <div className="flex flex-wrap justify-evenly">
                    {/* {`Box`} */}

                    {component.Children.map((childComponent, childIndex) => (
                      <div key={childIndex} className="flex">
                        {childComponent.type === "header" && (
                          <div className="">
                            <h4 className="text-lg font-semibold text-gray-800">
                              Header
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
                              >
                                Delete
                              </button>
                            </div>
                            <label
                              htmlFor={`heading-input-${childIndex}`}
                              className="block text-gray-700"
                            >
                              Label:
                            </label>
                            <input
                              type="text"
                              id={`heading-input-${childIndex}`}
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                          </div>
                        )}

                        {childComponent.type === "textInput" && (
                          <div className="">
                            <h4 className="text-lg font-semibold text-gray-800">
                              Text Input
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
                              >
                                Delete
                              </button>
                            </div>
                            <label
                              htmlFor={`text-label-${childIndex}`}
                              className="block text-gray-700"
                            >
                              Label:
                            </label>
                            <input
                              type="text"
                              id={`text-label-${childIndex}`}
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <label
                              htmlFor={`text-placeholder-${childIndex}`}
                              className="block text-gray-700 mt-2"
                            >
                              Placeholder:
                            </label>
                            <input
                              type="text"
                              id={`text-placeholder-${childIndex}`}
                              value={childComponent.placeholder}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "placeholder",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <div className="mt-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`required-checkbox-${childIndex}`}
                                checked={childComponent.required}
                                onChange={(e) =>
                                  handleNestedComponentChange(
                                    index,
                                    childIndex,
                                    "required",
                                    e.target.checked
                                  )
                                }
                                className="mr-2"
                              />
                              <label
                                htmlFor={`required-checkbox-${childIndex}`}
                                className="text-gray-700"
                              >
                                Required
                              </label>
                            </div>
                          </div>
                        )}
                         {childComponent.type === "radio" && (
  <div className="mt-4">
    <h4 className="text-lg font-semibold text-gray-800">Radio Button</h4>
    <div className="flex justify-end">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        onClick={() => handleNestedDeleteComponent(index, childIndex)}
      >
        Delete
      </button>
    </div>
    <label htmlFor={`radio-label-${index}`} className="block text-gray-700">
      Label:
    </label>
    <input
      type="text"
      id={`radio-label-${index}`}
      value={component.label}
      onChange={(e) =>handleNestedComponentChange(
        index,
        childIndex,
        "label",
        e.target.value
      )}
      className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
    />
    <div className="mt-2">
    <p className="text-gray-700 mt-2">
                  Enter Options separated by commas (,)
                </p>
                <input
                  type="text"
                  placeholder="Option 1, Option 2, ..."
                  value={component.options?.join(", ")}
                  onChange={(e) => handleNestedOptionsChange(
                    index,
                    childIndex,
                    e.target.value
                  )}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                />
    </div>
  </div>
)}

                        {childComponent.type === "textarea" && (
                          <div className="" key={index}>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Text Area
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
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
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
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
                              value={childComponent.placeholder}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "placeholder",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <div className="mt-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`required-checkbox-${index}`}
                                checked={childComponent.required}
                                onChange={(e) =>
                                  handleNestedComponentChange(
                                    index,
                                    childIndex,
                                    "required",
                                    e.target.checked
                                  )
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
                        )}

                        {childComponent.type === "checkbox" && (
                          <div className="" key={index}>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Checkbox
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
                              >
                                Delete
                              </button>
                            </div>
                            <label
                              htmlFor={`checkbox-label-${index}`}
                              className="block text-gray-700"
                            >
                              Label:
                            </label>
                            <input
                              type="text"
                              id={`checkbox-label-${index}`}
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <div className="mt-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`required-checkbox-${index}`}
                                checked={childComponent.required}
                                onChange={(e) =>
                                  handleNestedComponentChange(
                                    index,
                                    childIndex,
                                    "required",
                                    e.target.checked
                                  )
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
                        )}

                        {childComponent.type === "dropdown" && (
                          <div className="" key={index}>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Drop Down
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
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
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <p className="text-gray-700 mt-2">
                              Enter Options separated by commas (,)
                            </p>
                            <input
                              type="text"
                              placeholder="Option 1, Option 2, ..."
                              value={childComponent.options?.join(", ")}
                              onChange={(e) =>
                                handleNestedOptionsChange(
                                  index,
                                  childIndex,
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            <p className="text-gray-700 mt-2">provide a link</p>
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="http://......"
                                value={component.link}
                                onChange={(e) =>
                                  handleLinkNestedChange(
                                    index,
                                    childIndex,
                                    e.target.value
                                  )
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                              />
                              <button
                                onClick={() =>
                                  getDataOfOptionsFromTheLinkNested(
                                    index,
                                    childIndex
                                  )
                                }
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                              >
                                Get
                              </button>
                            </div>
                            <div className="mt-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`required-checkbox-${index}`}
                                checked={childComponent.required}
                                onChange={(e) =>
                                  handleNestedComponentChange(
                                    index,
                                    childIndex,
                                    "required",
                                    e.target.checked
                                  )
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
                        )}

                        {["numberinput", "datepicker", "fileupload"].includes(
                          childComponent.type
                        ) && (
                          <div className="" key={index}>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {childComponent.type === "numberinput" &&
                                "Number Input"}
                              {childComponent.type === "datepicker" &&
                                "Date Picker"}
                              {childComponent.type === "fileupload" &&
                                "File Upload"}
                            </h4>
                            <div className="flex justify-end">
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                onClick={() =>
                                  handleNestedDeleteComponent(index, childIndex)
                                }
                              >
                                Delete
                              </button>
                            </div>
                            <label
                              htmlFor={`component-label-${index}`}
                              className="block text-gray-700"
                            >
                              Label:
                            </label>
                            <input
                              type="text"
                              id={`component-label-${index}`}
                              value={childComponent.label}
                              onChange={(e) =>
                                handleNestedComponentChange(
                                  index,
                                  childIndex,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                            {childComponent.type !== "fileupload" && (
                              <div className="mt-2 flex items-center">
                                <input
                                  type="checkbox"
                                  id={`required-checkbox-${index}`}
                                  checked={childComponent.required}
                                  onChange={(e) =>
                                    handleNestedComponentChange(
                                      index,
                                      childIndex,
                                      "required",
                                      e.target.checked
                                    )
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
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {["numberinput", "datepicker", "fileupload"].includes(
              component.type
            ) && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {component.type === "numberinput" && "Number Input"}
                  {component.type === "datepicker" && "Date Picker"}
                  {component.type === "fileupload" && "File Upload"}
                </h4>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteComponent(index)}
                  >
                    Delete
                  </button>
                </div>
                <label
                  htmlFor={`${component.type}-label-${index}`}
                  className="block text-gray-700"
                >
                  Label:
                </label>
                <input
                  type="text"
                  id={`${component.type}-label-${index}`}
                  value={component.label}
                  onChange={(e) =>
                    handleComponentChange(index, "label", e.target.value)
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
            )}
          </div>
        ))}

        {/* previous  */}
      </div>

      {formComponents.length > 0 && (
        <button
          className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out ml-2"
          onClick={handleFinalSubmit}
        >
          Confirm and Submit
        </button>
      )}
    </div>
  );
}
