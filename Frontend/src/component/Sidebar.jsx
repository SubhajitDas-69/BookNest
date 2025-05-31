import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";
export default function Sidebar() {
    const navigate = useNavigate();
    const { currUser, setCurrUser, loading } = useAuth();
    async function logout() {
        try {
            const res = await fetch("https://booknest-3ev5.onrender.com/logout", {
                credentials: "include",
                method: "GET",
            });
            const data = await res.json();
            if (data.success) {
                setCurrUser(null);
                navigate("/");
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (!currUser || loading) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="sidebar-content">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {currUser && currUser.role === "user" && (
                        <div>
                            <li><Link to="/orders">Order History</Link></li>
                            <li><Link to="/address/all">Your Addresses</Link></li>
                        </div>
                    )}
                    {currUser && currUser.role != "user" && (
                        <li><Link to="/orders/all">All Orders</Link></li>
                    )}
                    <li><Link to="/products">All Products</Link></li>
                    {currUser && currUser.role != "user" && (
                        <div>
                            <li className="manage-category">
                                <input type="checkbox" id="check" hidden />
                                <label htmlFor="check">
                                    <div><b>Manage By Categories</b></div>
                                </label>
                                <ul className="checkbox-toggle" style={{ marginTop: '1rem' }}>
                                    <li className="tag"><Link to="/products?category=Books">Books</Link></li>
                                    <li className="tag"><Link to="/products?category=Notes">Notes</Link></li>
                                </ul>
                            </li>
                            <li><Link to="/products/new">Add new Item</Link></li>
                        </div>

                    )}
                </ul>
                <button onClick={logout}>Logout <i className="fa-solid fa-arrow-right-from-bracket" /></button>

            </div>
        </>
    )
}