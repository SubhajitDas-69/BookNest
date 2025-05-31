import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import OrderTracker from "../component/OrderTracker";
import Button from '@mui/material/Button';
export default function OrderConfirm() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`https://booknest-3ev5.onrender.com/orders/confirm/${orderId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setOrder(data.updatedOrder);
        } else {
          alert("Failed to confirm order.");
        }
      } catch (err) {
        console.error("Error fetching confirmed order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'notes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (!order && loading) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }

  return (
    <div>
      <div style={{ marginBottom: '8rem' }}>
        <OrderTracker activeStep={5} />
      </div>
      <h2 style={{textAlign: 'center'}}>Your Order</h2>
      {order.items.map((orderItem) => (
        <div className="orderHistory" key={orderItem._id}>
          <div id="orderDetails">
            <div className="itemImg">
              <img src={orderItem.item.image.url} alt="Image" />
            </div>
            <div className="itemDetails">
              <p>{orderItem.item.title}</p>
              <p>by: {orderItem.item.author}</p>
              <p>&#8377;{orderItem.item.price}</p>

               {orderItem.item.category === "Notes" && orderItem.item.pdf?.url && (
                <Button variant="contained" color="primary"onClick={() => 
                  handleDownload(orderItem.item.pdf.url, orderItem.item.pdf.filename
                  )}
                  style={{ marginTop: "1rem" }}>
                  Download Your Note
                </Button>
              )}
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
  );
}
