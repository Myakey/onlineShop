import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button"; // gunakan default export

const OrderSummary = ({ total, onPlaceOrder }) => (
  <Card className="max-w-sm">
    <h2 className="text-lg font-bold mb-2">Ringkasan Pesanan</h2>
    <p className="mb-4">Total: <span className="font-bold">${total}</span></p>
    <Button text="Place Order" onClick={onPlaceOrder} />
  </Card>
);

export default OrderSummary;
