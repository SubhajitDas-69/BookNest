import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../component/SidebarLayout";
import { useAuth } from "../component/AuthContext";
import { CircularProgress } from "@mui/material";
export default function AllAddress() {
  const [addresses, setAddresses] = useState([]);
  const { currUser } = useAuth();
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("https://booknest-cnfb.onrender.com/address/all", {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setAddresses(data.addresses);
        } else {
          console.log("Failed to fetch addresses", data.message);
        }
      } catch (err) {
        console.log("Error fetching addresses:", err);
      }
    }

    fetchAddresses();
  }, []);

  const handleDelete = async (addressId) => {
    try {
      const res = await fetch(`https://booknest-cnfb.onrender.com/address/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== addressId)
        );
      } else {
        console.error("Failed to delete address", data.message);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
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
        <h3>Your Addresses</h3>
        <div className="addresses-div">
          <Link to="/address/new">
            <div className="address add-address">
              <i className="fa-solid fa-plus"></i>
              <h3>Add Address</h3>
            </div>
          </Link>

          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div className="address" key={address._id}>
                <p>{address.fullName}</p>
                <p>{address.street}, {address.landmark}</p>
                <p>{address.city}, {address.state}</p>
                <p>Pincode: {address.pincode}</p>
                <p>{address.country}</p>
                <p>Phone number: {address.phone}</p>
                <button
                  onClick={() => handleDelete(address._id)}
                  style={{
                    color: "red",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No addresses available.</p>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
