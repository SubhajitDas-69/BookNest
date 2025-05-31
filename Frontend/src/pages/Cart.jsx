import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            try {
                setLoading(true);
                const res = await fetch("https://booknest-cnfb.onrender.com/cart", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setCart(data.cart);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, []);

    useEffect(() => {
        if (!cart) return;
        let quantity = 0;
        let price = 0;

        cart.items.forEach((item) => {
            quantity += item.quantity;
            price += item.quantity * item.item.price;
        });

        setTotalQuantity(quantity);
        setTotalPrice(price);
    }, [cart]);

    const updateQuantity = async (itemId, action) => {
        try {
            const res = await fetch(`https://booknest-cnfb.onrender.com/cart/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (res.ok) {
                const updated = await fetch("https://booknest-cnfb.onrender.com/cart", {
                    method: "GET",
                    credentials: "include",
                });
                const result = await updated.json();
                setCart(result.cart);
            }
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await fetch(`https://booknest-cnfb.onrender.com/cart/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const updated = await fetch("https://booknest-cnfb.onrender.com/cart", {
                method: "GET",
                credentials: "include",
            });
            const result = await updated.json();
            setCart(result.cart);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };
     if (loading) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }
    if (!cart || cart.items.length === 0) {
        return (
            <div className="Emptycart">
                <h2>Your Cart is empty</h2>
                <hr />
                <img src="/img/empty-cart-img.svg" alt="Your Cart is empty" />
            </div>
        );
    }
    return (
        <div className="cart">
            {loading &&
            <div></div>
            }
            <div className="cart-items">
                <div id="cart-title">
                    <h2>Shopping Cart</h2>
                    <b>Price</b>
                </div>
                <hr />

                {cart.items.map((cartItem) => (
                    <div className="flex-item" key={cartItem.item._id}>
                        <div className="item">
                            <img src={cartItem.item.image.url} alt={cartItem.item.title} />
                        </div>
                        <div className="item-des">
                            <b>{cartItem.item.title}</b>
                            <p>By: {cartItem.item.author}</p>

                            <div className="cart-add-del-btn">
                                {cartItem.quantity === 1 && (
                                    <button onClick={() => removeItem(cartItem.item._id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}
                                {cartItem.quantity > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                updateQuantity(cartItem.item._id, "decrease")
                                            }
                                        >
                                            <i className="fa-solid fa-minus"></i>
                                        </button>
                                    </>
                                )}
                                <span>{cartItem.quantity}</span>
                                <button
                                    onClick={() =>
                                        updateQuantity(cartItem.item._id, "increase")
                                    }
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>

                            </div>
                        </div>
                        <div className="item-price">
                            <b>&#8377; {cartItem.item.price}</b>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-btn-div">
                <h4>
                    Subtotal ({totalQuantity} items): ₹{totalPrice.toLocaleString("en-IN")}
                </h4>
                <Link to={`/address?checkout=fromCart`}>
                    <button>Proceed to Buy</button>
                </Link>
            </div>
        </div>
    );
}
