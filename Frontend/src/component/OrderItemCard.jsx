import { useState } from 'react';
import { Button } from '@mui/material';
const OrderItemCard = ({ orderId, orderItem, shippingAddress, onStatusChange, onDelete }) => {
  if (!orderItem || !orderItem.item) return null;

  const [localStatus, setLocalStatus] = useState(orderItem.status);

  const handleSelectChange = (e) => {
    setLocalStatus(e.target.value);
  };

  const handleStatusUpdate = () => {
    if (localStatus !== orderItem.status) {
      onStatusChange(orderId, orderItem._id, localStatus); 
    }
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(orderId, orderItem._id);
    }
  };
  return (
    <div className="orderHistory orders">
      <div id="orderDetails">
        <div className="itemImg">
          <img src={orderItem.item.image.url} alt="Product" />
        </div>
        <div className="itemDetails">
          <p>{orderItem.item.title}</p>
          <p>by: {orderItem.item.author}</p>
          <p>&#8377;{orderItem.item.price}</p>
        </div>
      </div>
      <div className="status">
        <select
          name="status"
          className="status-select"
          value={localStatus}
          onChange={handleSelectChange}
        >
          <option value="Order Confirmed">Order Confirmed</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Out of Delivery">Out of Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleStatusUpdate} style={{color: "white", backgroundColor: "green"}}>
          UPDATE
        </button>
      </div>
      <div className='deleteOrder'>
        <Button variant='contained' style={{ backgroundColor: 'red'}}
        onClick={handleDelete}>Delete</Button>
      </div>
      <div className="shippingDetails section4">
        <p>{shippingAddress.fullName}</p>
        <p>
          {shippingAddress.street}<br />
          {shippingAddress.landmark}<br />
          {shippingAddress.phone}<br />
          {shippingAddress.pincode}
        </p>
      </div>
    </div>
  );
};

export default OrderItemCard;
