
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
export default function ProductCard({ props, onDelete, showAlert }) {
  const { currUser} = useAuth();
  const [loading, setLoading] = useState(false);
  const addToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://booknest-3ev5.onrender.com/cart/add/${props._id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        showAlert(data.msg, "success");
      } else {
        showAlert("Failed to add to cart: " + (data.message || ""), "error");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      showAlert("Error adding to cart", "error");
    }finally{
        setLoading(false);
      }
  };
 
  return (
    <div className="index-card" key={props._id}>
      <div className="index-card">
        <Link to={`/products/${props._id}`}>
          <div className="Img-card">
            <img src={props.image.url} />
          </div>
          <div className="details-card">
            <p className="book-title">{props.title}</p>
            <p>{props.author}</p>

            <div className="price-info">
              <p>&#8377; {props.price.toLocaleString("en-IN")}</p>
              <p className="book-discount">{props.discount} %off</p>
            </div>
          </div>
        </Link>

        <div className="form">
          {currUser && currUser.role === 'admin' && (
          <Button className="btnControl delete" onClick={() => onDelete(props._id)}  variant="contained">Delete</Button>
         )}

        {currUser && currUser.role !== 'admin' && (
          <button className="btnControl" onClick={addToCart} disabled={loading}>
          {loading ? <CircularProgress color="inherit" /> : "ADD TO CART"}
          </button>
          
        )}
        </div>
        

      </div>
    </div>
  )
}