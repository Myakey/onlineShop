import React from "react";
import ProductCard from "../products/ProductCard";
import Button from "../ui/Button"; // default export Button

const OrderItem = ({ product, onRemove }) => (
  <div className="flex items-center justify-between border-b py-2">
    <ProductCard product={product} />
    <Button text="Hapus" onClick={() => onRemove(product.id)} />
  </div>
);

export default OrderItem;
