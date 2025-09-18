import React from "react";
import { getProducts } from "../services/exampleService";
import { useState, useEffect } from "react";

function homePage(){
    const [products, setProducts] = useState([]);

        //     useEffect(() => {
        //     (async () => {
        //       const data = await getProducts(); // already resolved if service returns res.data
        //       setProducts(data);
        //     })();
        //   }, []);

    useEffect(() => {
        getProducts().then(res => setProducts(res.data.fruits));
    }, []);



    return(
        <>
            <div className="">
                <p>This is your homepage</p>
                {
                    products.map((fruits, index) => {
                        return(
                            <>
                            <div key={index}>
                                {fruits}
                            </div>
                            <br />
                            </>     
                        )
                    })
                }
            </div>
        </>
    )
}

export default homePage;