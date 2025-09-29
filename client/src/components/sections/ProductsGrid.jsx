import React from "react";
import ProductCard from "../products/ProductCard";
import Button from "../ui/Button";

const ProductsGrid = ({ products, onDelete, onAdd }) => (
  <section className="py-16 px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} onDelete={onDelete} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button onClick={onAdd} text={"Add New Item"} />
      </div>
    </div>
  </section>
);

export default ProductsGrid;
