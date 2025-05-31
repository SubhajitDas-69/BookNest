import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
export default function Home() {
   const [showLoader, setShowLoader] = useState(false);
  useEffect(()=>{
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 2000);
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
      <div className="header">
        <div className="header-content">
          <h1>Welcome to BookNest</h1>
          <p>Please Login or Sign Up</p>
          <Link to="/products">
            <button className="exp-btn">Explore</button>
          </Link>
        </div>
        <img src="/img/homeImg.webp" alt="home" />
      </div>

      <div className="categories">
        <h3>SHOP BY CATEGORIES</h3>
        <div className="home">
          <Link to="/products?category=Books">
            <div className="category">
              <i className="fa-solid fa-book" />
            </div>
            <b>Books</b> <i className="fa-solid fa-arrow-right" />
          </Link>
          <Link to="/products?category=Notes">
            <div className="category">
              <i className="fa-solid fa-note-sticky" />
            </div>
            <b>Notes</b> <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
