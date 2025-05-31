
import { useEffect, useState } from 'react';
import OrderItemCard from '../component/OrderItemCard';
import SidebarLayout from '../component/SidebarLayout';
import { useAuth } from '../component/AuthContext';
import { CircularProgress } from '@mui/material';

const AllOrder = () => {
  const { currUser } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch('https://booknest-cnfb.onrender.com/orders/all', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        if (data.success) setOrders(data.orders);
      })
      .catch(err => console.error(err));
  }, []);


  const updateStatus = async (orderId, itemId, status) => {
    try {
      const res = await fetch(`https://booknest-cnfb.onrender.com/orders/status/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId, status })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setOrders(prevOrders =>
          prevOrders.map(order => {
            if (order._id === orderId) {
              return {
                ...order,
                items: order.items.map(item =>
                  item._id === itemId ? { ...item, status } : item
                )
              };
            }
            return order;
          })
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const deleteOrderItem = async (orderId, itemId) => {
    try {
      const res = await fetch(`https://booknest-cnfb.onrender.com/orders/${orderId}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setOrders(prevOrders =>
          prevOrders
            .map(order => {
              if (order._id === orderId) {
                const updatedItems = order.items.filter(item => item._id !== itemId);
                return updatedItems.length > 0
                  ? { ...order, items: updatedItems }
                  : null;
              }
              return order;
            })
            .filter(order => order !== null)
        );
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };
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
        <div id="order-header">
          <div id="section1">
            <b>Product</b>
            <b>Details</b>
          </div>
          <div id="section2">
            <b>Status</b>
          </div>
          <div id="section4">
            <b>Delete</b>
          </div>
          <div id="section3">
            <b>Shipping Address</b>
          </div>
        </div>

        {orders.map(order =>
          order.items.map(orderItem => (
            <OrderItemCard
              key={orderItem._id}
              orderId={order._id}
              orderItem={orderItem}
              shippingAddress={order.shippingAddress}
              onStatusChange={updateStatus}
              onDelete={deleteOrderItem}
            />
          ))
        )}
      </div>
    </SidebarLayout>
  );
};

export default AllOrder;
