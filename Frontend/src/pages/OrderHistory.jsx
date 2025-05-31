import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { useAuth } from "../component/AuthContext";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import SidebarLayout from "../component/SidebarLayout";

export default function OrderHistory() {
    const { currUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const url = "https://booknest-3ev5.onrender.com/orders";

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                console.log("Fetched orders:", data);
                setOrders(data.orders || []);

            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }

        fetchOrders();
    }, []);
    if (!currUser) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
       <SidebarLayout currUser={currUser}>
            <div className="content">
                {orders.length === 0 && (
                    <div className="emptyOrder">
                        <h1>No order found!</h1>
                        <h2>Order Now</h2>
                    </div>
                )}
                {orders.length > 0 && (
                    <div id="order-header">
                        <div id="section1">
                            <b>Product</b>
                            <b>Details</b>
                        </div>
                        <div id="section2">
                            <b>Status</b>
                        </div>
                        <div id="section3">
                            <b>Shipping Address</b>
                        </div>
                    </div>
                )}

                {orders.map((order) =>
                    order.items.map((orderItem) => (
                        <div>
                            <Link to={`/order/${orderItem._id}`}>
                            <div className="orderHistory orders" key={orderItem._id}>
                                <div id="orderDetails">
                                    <div className="itemImg">
                                        <img src={orderItem.item.image?.url} alt="Image" />
                                    </div>
                                    <div className="itemDetails">
                                        <p>{orderItem.item.title}</p>
                                        <p>by: {orderItem.item.author}</p>
                                        <p>₹{orderItem.item.price}</p>
                                    </div>
                                </div>

                                {orderItem.status === "Order Placed" && (
                                    <div className="status placed">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}
                                {orderItem.status === "Order Confirmed" && (
                                    <div className="status Confirmed">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}
                                {orderItem.status === "Out of Delivery" && (
                                    <div className="status outOfdelivary">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}
                                {orderItem.status === "Delivered" && (
                                    <div className="status delivered">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}
                                {orderItem.status === "Cancelled" && (
                                    <div className="status cancelled">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}
                                {orderItem.status === "Pending" && (
                                    <div className="status pending">
                                        <b>{orderItem.status}</b>
                                    </div>
                                )}

                                <div className="shippingDetails section4">
                                    <p>{order.shippingAddress.fullName}</p>
                                    <p>
                                        {order.shippingAddress.street} <br />
                                        {order.shippingAddress.landmark},
                                        {order.shippingAddress.city} <br />
                                        {order.shippingAddress.phone},
                                        {order.shippingAddress.pincode}
                                    </p>
                                </div>
                            </div>
                            </Link>
                            
                        </div>

                    ))
                )}
            </div>
        </SidebarLayout>
    );
}
