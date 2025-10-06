import { useCart } from "../context/cartContext";


export default function DebugPage() {
    const { cart, cartCount, loading, fetchCart, fetchCartCount, addItem, updateItem, removeItem, clearCart, validate } = useCart();

    return(
        <>
            <h1>
                Button For adding to Cart
                <button className="p-2 bg-amber-300" onClick={() => addItem(2, 1)}>Add Item</button>
            </h1>
        </>
    )


}
