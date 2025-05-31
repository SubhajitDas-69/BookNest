import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VerticalStepper from "../component/VerticalStepper";
import OrderCancelStepper from "../component/OrderCancelStepper";
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import AlertMessage from '../component/AlertMessage';

export default function Order() {
  const { itemId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: '', severity: '' });
  const fetchOrderItem = async () => {
    try {
      const res = await fetch(`https://booknest-3ev5.onrender.com/orders/item/${itemId}`, {
        credentials: "include",
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) setOrderData(data);
      else console.error("Error fetching item:", data.message);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrderItem();
  }, [itemId]);

  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://booknest-3ev5.onrender.com/orders/${itemId}/cancel`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAlert({ msg: "Item cancelled successfully!", severity: "success" });
        fetchOrderItem();
      } else {
        setAlert({ msg: data.message, severity: "error" });
      }
    } catch (err) {
      setAlert({ msg: "Something went wrong!", severity: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="LoaderContainer">
        <div className="Loader">
          <CircularProgress />
        </div>
      </div>
    );
  }
  const { orderItem, shippingAddress } = orderData;

  return (
    <div className="orderBackground">
      <AlertMessage alert={alert} setAlert={setAlert} />
      <div className="orderDetails">
        <div className="itemCard">
          <div className="Item">
            <div className="aboutItem" style={{ lineHeight: '1rem', width: '50%' }}>
              <h4>{orderItem.item.title}</h4>
              <p>by: {orderItem.item.author}</p>
              <p>Price: ₹{orderItem.item.price}</p>
              <p>Discount: {orderItem.item.discount}%</p>
              <p>Quantity: {orderItem.quantity}</p>
            </div>
            <div className="itemImage">
              <img
                src={orderItem.item.image?.url}
                alt={orderItem.item.title}
                width="150"
              />
            </div>
          </div>
          <div style={{ padding: '1rem' }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
              disabled={orderItem.status === "Cancelled" || orderItem.status === "Delivered" || orderItem.status === "Shipped" || orderItem.status === "Out of Delivery" || loading}
            >
              {loading ? "Cancelling..." : "CANCEL ORDER"}
            </Button>

            <hr />
            {orderItem.status != "Cancelled" &&
              <VerticalStepper currentStatus={`${orderItem.status}`} />
            }
            {orderItem.status === "Cancelled" &&
              <OrderCancelStepper currentStatus={`${orderItem.status}`} />
            }

          </div>
        </div>
        <div className="shippingInfo">
          <h3>Shipping Details</h3>
          <p><b>Name:</b> {shippingAddress.fullName}</p>
          <p><b>Street:</b> {shippingAddress.street}</p>
          <p><b>Landmark:</b> {shippingAddress.landmark}</p>
          <p><b>City:</b> {shippingAddress.city}, {shippingAddress.state}</p>
          <p><b>Phone:</b> {shippingAddress.phone}</p>
          <p><b>Pincode:</b> {shippingAddress.pincode}</p>
        </div>
      </div>
    </div>

  );
}
