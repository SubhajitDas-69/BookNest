import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext";
export default function Navbar() {
    const { currUser } = useAuth();

    return (
        <div className="Nav">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <div className="navbar-brand">
                        <i className="fa-solid fa-book-open" />
                        <h4>BookNest</h4>
                    </div>
                    <div className="toggle-menu">
                        <input type="checkbox" id="Check" />
                        <div className="btn_one navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" >
                            <label htmlFor="Check">
                                <i className="fa-solid fa-bars navbar-toggler-icon" style={{ color: 'White' }} />
                            </label>
                        </div>
                        <div className="sidebar_menu">
                            <div className="btn_two">
                                <label htmlFor="Check" style={{ color: 'grey' }}>
                                    <i className="fa-solid fa-xmark" />
                                </label>
                            </div>
                            <div className="menu navbar-nav">
                                <ul>
                                    {(currUser && currUser.role === "user" || !currUser) && (
                                    <Link className="nav-link" to="/">
                                        <li>
                                            Home
                                        </li>
                                    </Link>
                                    )}
                                    <Link className="nav-link" to="/products">
                                        <li>
                                            All Products
                                        </li>
                                    </Link>
                                    {!currUser && (
                                        <div>
                                            <Link to="/signup">
                                        <li>
                                            <button className="Sign-in-btn">Sign Up</button>
                                        </li>
                                    </Link>
                                    <Link to="/login">
                                        <li>
                                            <button className="Sign-in-btn">Login</button>
                                        </li>
                                    </Link>
                                        </div>
                                     )}
                                    {currUser && currUser.role === "user" && (
                                    <Link to="/cart" className="cartLogo">
                                        <li>

                                            <i className="fa-solid fa-cart-shopping" />

                                        </li>
                                    </Link>
                                    )}
                                    {currUser && (
                                    <Link to="/profile">
                                        <li>

                                            <div className="Profile">
                                                <i className="fa-solid fa-user" />
                                            </div>

                                        </li>
                                    </Link>
                                    )}
                                </ul>
                            </div>
                        </div></div>

                    <div className="collapse navbar-collapse">
                        <div className="navbar-nav">
                            {(currUser && currUser.role === "user" || !currUser) && (
                            <Link className="nav-link" to="/">Home</Link>
                            )}
                            <Link className="nav-link" to="/products">All Products</Link>
                            {!currUser && (
                            <div className="register">
                                <Link to="/signup"><button className="Sign-in-btn">Sign Up</button></Link>
                                <Link to="/login"><button className="Sign-in-btn">Login</button></Link>
                            </div>
                            )}
                            {currUser && currUser.role === "user" && (
                            <Link to="/cart" className="cartLogo">
                                <i className="fa-solid fa-cart-shopping" />
                            </Link>
                            )}

                            {currUser && (
                            <Link to="/profile">
                                <div className="Profile">
                                    <i className="fa-solid fa-user" />
                                </div>
                            </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}