import React from "react";
import { LostItem, FoundItem } from "../../types/index";

type Props = {
  item: LostItem | FoundItem;
  onClick: () => void;
};

const ItemCard: React.FC<Props> = ({ item, onClick }) => {
  return (
    <div className="item" onClick={onClick}>
      <button className={`item-category ${item.category}`}>{item.category}</button>
      <div className="item-title">{item.name}</div>
      <button className="item-date">{item.date}</button>
    </div>
  );
};

export default ItemCard;