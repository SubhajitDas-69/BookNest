import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import OrderTracker from "../component/OrderTracker";
import Button from '@mui/material/Button';

export default function OrderSummary({ product, selectedAddress, checkout }) {
    const navigate = useNavigate();
    if (!product || !selectedAddress) {
        return <CircularProgress />;
    }
    let order = {
        items: [],
        shippingAddress: selectedAddress,
        amount: 0,
    };

    if (checkout === "buyNow") {
        order.items = [{
            item: product,
            quantity: 1
        }];
    } else {
        order.items = product;
    }
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = order.items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    order.amount = totalAmount;

    async function handlePayment() {
        let url = "";
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ selectedAddress })
        };
        if (checkout === "buyNow") {
            url = `https://booknest-3ev5.onrender.com/orders/checkout/buyNow/${product._id}`;
            
        } else {
            url = `https://booknest-3ev5.onrender.com/orders/create`;
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok && data.redirectTo) {
                navigate(data.redirectTo);
            } else {
                alert("Order creation failed: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Payment error:", err);
            alert("Something went wrong while initiating payment.");
        }
    }
    return (
        <div>
            <div style={{ marginBottom: '8rem' }}>
                <OrderTracker activeStep={2} />
            </div>

            <div className="summaryDiv">
                <div style={{ width: '100%' }}>
                    {order.items.map((orderItem) => (
                        <div className="orderSummary" key={orderItem.item._id}>
                            <div id="orderDetails">
                                <div className="itemImg">
                                    <img src={orderItem.item.image.url} alt="Image" />
                                </div>
                                <div className="itemDetails">
                                    <p>{orderItem.item.title}</p>
                                    <p>by: {orderItem.item.author}</p>
                                    <p>Price: ₹{orderItem.item.price}</p>
                                    <p>Quantity: {orderItem.quantity}</p>
                                </div>
                            </div>
                            <div className="shippingDetails">
                                <p>{order.shippingAddress.fullName}</p>
                                <p>
                                    {order.shippingAddress.street} <br />
                                    {order.shippingAddress.landmark} <br />
                                    {order.shippingAddress.phone} <br />
                                    {order.shippingAddress.pincode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="BuyProduct">
                    <h4><b>Subtotal:</b><span>{totalQuantity} items</span></h4>
                    <hr />
                    <h4 style={{ color: 'green' }}> <b>Total Price:</b> <span>₹{order.amount}</span></h4>
                    <Button variant="contained" className="Payment-btn" onClick={handlePayment}>PAYMENT</Button>
                </div>
            </div>
        </div>
    );
}
