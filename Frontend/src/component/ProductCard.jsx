
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useAuth } from "./AuthContext";
export default function ProductCard({ props, onDelete }) {
  const { currUser} = useAuth();
  const addToCart = async () => {
    try {
      const res = await fetch(`https://booknest-cnfb.onrender.com/cart/add/${props._id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.msg);
      } else {
        alert("❌ Failed to add to cart: " + (data.message || ""));
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Error adding to cart");
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
          <button className="btnControl" onClick={addToCart}>Add to cart</button>
        )}
        </div>
        

      </div>
    </div>
  )
}