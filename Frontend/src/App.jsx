import { useState } from 'react';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from './pages/Product';
import Cart from './pages/Cart';
import SelectAddress from './pages/SelectAddress';
import NewAddress from "./pages/NewAddress";
import CreatePayment from "./pages/CreatePayment";
import OrderConfirm from './pages/OrderConfirm';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import EditProductForm from './pages/EditProductForm';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AllOrder from './pages/AllOrder';
import AllAddress from './pages/AllAddress';
import NewProduct from './pages/NewProduct';
import EditAddress from './pages/EditAddress';
import Order from './pages/Order';
function App() {
  return (
    <>
    <Navbar/>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product/>} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/address/all" element={<AllAddress/>}/>
        <Route path="/address/:id?" element={<SelectAddress />} />
        <Route path="/address/new/:id?" element={<NewAddress />} />
        <Route path="/address/:id/edit" element={<EditAddress />} />
        <Route path="/payment/:orderId/create-payment-link" element={<CreatePayment />} />
        <Route path="/orders/confirm/:orderId" element={<OrderConfirm/>}/>
        {/* <Route path="/orders/summary/:orderId" element={<OrderSummary/>}/> */}
        <Route path="/Edit/:id" element={<EditProductForm/>}/>
        <Route path="/orders" element={<OrderHistory/>}/>
        <Route path="/orders/all" element={<AllOrder/>}/>
        <Route path="/products/new" element={<NewProduct/>}/>
        <Route path="/order/:itemId" element={<Order/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
