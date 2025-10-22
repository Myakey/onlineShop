import React from "react";
import { deleteProduct, getProducts } from "../services/exampleService";
import { useState, useEffect } from "react";
import box from "../assets/box.png";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  //     useEffect(() => {
  //     (async () => {
  //       const data = await getProducts(); // already resolved if service returns res.data
  //       setProducts(data);
  //     })();
  //   }, []);

  //Fetching data from the backend trial
  //   useEffect(() => {
  //     const fetchProducts = async () => {
  //       try {
  //         const response = await getProducts();
  //         setProducts(response.data);
  //         console.log(response.data);
  //         console.log(products);
  //       } catch (error) {
  //         console.error("Error fetching products:", error);
  //       }
  //     };

  //     fetchProducts();
  //   }, []);

  const handleDelete = (id) => {
    deleteProduct(id)
    .then(() => {
      setProducts(products.filter(product => product.id !== id));
      window.location.reload();
    })
    .catch(err => console.error("Error deleting product:", err));
  }

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  //Function to change to a new page
  const goToAddItem = () => {
    navigate("/add-product");
  };

  return (
    <>
      <div className="h-max w-auto">
        <div className="">
          <p>This is your homepage</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} onDelete={handleDelete}/>
          ))}
        </div>

        <Button onClick={goToAddItem} text={"Go To Add Item"} />
      </div>
    </>
  );
}

export default HomePage;
