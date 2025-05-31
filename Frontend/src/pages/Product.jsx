import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { CircularProgress } from "@mui/material";

export default function Product() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const url = category
    ? `https://booknest-cnfb.onrender.com/products?category=${category}`
    : `https://booknest-cnfb.onrender.com/products`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.allProduct);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchData();
  }, [url]);

  const handleDelete = async (id) => {
  try {
    const deleteUrl = `https://booknest-cnfb.onrender.com/products/${id}`;
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Deleted:", data.message || "Success");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      console.error("Delete failed:", data.message);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
const [showLoader, setShowLoader] = useState(false);
  useEffect(()=>{
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 1500);
  },[]);
  if (showLoader) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }

  return (
    <div className="index-page">
      <div className="index-grid">
        {products.map((product) => (
          <ProductCard props={product} key={product._id} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
