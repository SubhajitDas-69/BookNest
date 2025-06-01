import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { CircularProgress } from "@mui/material";
import AlertMessage from "../component/AlertMessage";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState({ msg: '', severity: '' });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");


  const url = category
    ? `https://booknest-3ev5.onrender.com/products?category=${category}`
    : `https://booknest-3ev5.onrender.com/products`;
  
  const showAlert = (msg, severity = "success") => {
    setAlert({ msg, severity });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.allProduct);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        showAlert("Failed to load products", "error");
      }
    };
    fetchData();
  }, [url]);

  const handleDelete = async (id) => {
  try {
    const deleteUrl = `https://booknest-3ev5.onrender.com/products/${id}`;
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Deleted:", data.message || "Success");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showAlert("Product deleted", "success");
    } else {
      showAlert("Delete failed", "error");
      console.error("Delete failed:", data.message);
    }
  } catch (error) {
    showAlert("Error deleting product", "error");
    console.error("Error deleting product:", error);
  }
};
  if (!products) {
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
       <AlertMessage alert={alert} setAlert={setAlert} />
      <div className="index-grid">
        {products.map((product) => (
          <ProductCard props={product} key={product._id} onDelete={handleDelete} showAlert={showAlert} />
        ))}
      </div>
    </div>
  );
}
