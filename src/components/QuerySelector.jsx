import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import styles from "./QuerySelector.module.css";
import CartDroppable from "../QueryComponents/CardDroppable";
import FruitDraggable from "../QueryComponents/TableDraggable.tsx";
import React from "react";
import Dropdown from "../QueryComponents/Dropdown";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import DataTable from "react-data-table-component";

const QuerySelector = () => {
  const tables = ["students", "fees", "payments", "form145", "form122"];
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({});

  const [allData, setAllData] = useState([]);
  const [columns, setColumns] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [removedOptions, setRemovedOptions] = useState([]);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log("cartItems is", cartItems);
    console.log("formData is", formData);
    console.log("selectedOptions is", selectedOptions);

  }, [cartItems,formData,selectedOptions]);

  const addItemsToCart = (e) => {
    const newItem = e.active.data.current?.title;
    if (e.over?.id !== "cart-droppable" || !newItem) return;
    const temp = [...cartItems];
    temp.push(newItem);
    setCartItems(temp);
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const optionName =
      e.target.options[e.target.selectedIndex].getAttribute("name");

    setFormData((prevFormData) => ({
      ...prevFormData,
      [optionName]: selectedValue,
    }));
  };

  const onSelectOptions = (selectedList, selectedItem) => {
    setSelectedOptions([...selectedOptions, selectedItem]);
  };
  const onRemoveOptions = (selectedList, removedItem) => {
    let updatedOptions = selectedOptions.filter(item => item !== removedItem);
    setSelectedOptions(updatedOptions);
};

  const transformedData = allData.map((item) => ({
    name: item.label,
    id: item.value,
  }));

  const handleRemoveItem = (updatedItems,ItemName) => {
    console.log("updatedItems is", updatedItems);
    console.log("ItemName is", ItemName);

    setCartItems(updatedItems);
    // setFormData(field)
  }

  const handleGetData = () => {
    let dataToSend;
    if (cartItems.length > 0 && Object.keys(formData).length > 0 && selectedOptions.length > 0) {
      dataToSend = {
        cartItems: cartItems,
        formData: formData,
        selectedOptions: selectedOptions,
      };
    console.log("formData1 is ", dataToSend);

    let receivedData;

    axios
      .post("http://localhost:3001/api/tables/generateQuery", dataToSend)
      .then((response) => {
        receivedData = response.data; // Assign response data to receivedData
        console.log("receivedData is", receivedData);
        if(receivedData.length === 0){
          alert("NO DATA, Please check the join condition.")
        }
        setTableData(response.data);
        let columns1 = Object.keys(receivedData[0]).map((key) => ({
          name: key,
          selector: (row) => row[key],
        }));
        setColumns(columns1);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
    }
    else{
      alert("All fields are required !!")
    }
  };

  return (
    <DndContext onDragEnd={addItemsToCart}>
      <main className={styles.main}>
        <div className={styles["fruit-list-section"]}>
          <h1>Table List</h1>
          <ul className={styles["fruit-list"]}>
            {tables.map((fruit) => (
              <FruitDraggable key={fruit}>{fruit}</FruitDraggable>
            ))}
          </ul>
        </div>
        <div className={styles["cart-section"]}>
          <h1>Drag and Drop tables</h1>
          <CartDroppable items={cartItems} onRemoveItem={handleRemoveItem}/>
        </div>
      </main>
      <div className="container mx-auto w-80" >
      <h3>Select Relation Fields</h3>
        <div className="flex flex-wrap">
         
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
            >
              <Dropdown
                item={item}
                index={index}
                handleChange={handleChange}
                setAllData={setAllData}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="m-10 flex">
        <div className="flex-1">
          <Multiselect
            options={transformedData} 
            selectedValues="" 
            onSelect={onSelectOptions} 
            onRemove={onRemoveOptions} 
            displayValue="name" 
            placeholder="Select options..."
          />
        </div>
        <button
          onClick={handleGetData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-3"
        >
          Get Data
        </button>
      </div>

      <div className="w-1/2 flex justify-center">
  {columns && (
    <DataTable
      columns={columns}
      data={tableData}
      className="w-full" 
    />
  )}
</div>
    </DndContext>
  );
};

export default QuerySelector;
