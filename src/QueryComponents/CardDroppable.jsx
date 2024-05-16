import React from "react";
import { useDroppable } from "@dnd-kit/core";
import styles from "./CardDroppable.module.css";

const CartDroppable = (props) => {
  const { setNodeRef } = useDroppable({
    id: "cart-droppable"
  });

  const removeItem = (indexToRemove) => {
    const itemName = props.items[indexToRemove];
    const updatedItems = props.items.filter((_, idx) => idx !== indexToRemove);
    props.onRemoveItem(updatedItems,itemName);
  };

  return (
    <ul className={styles.cart} ref={setNodeRef}>
      {props.items.map((item, idx) => (
        <div key={`${item}-${idx}`} className={styles["cart-item"]}>
          {item}
          <button className={styles["remove-button"]} onClick={() => removeItem(idx)}>×</button>
        </div>
      ))}
    </ul>
  );
};

export default CartDroppable;
