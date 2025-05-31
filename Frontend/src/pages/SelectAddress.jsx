import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams, Link } from "react-router-dom";
import OrderTracker from "../component/OrderTracker";
import OrderSummary from "./OrderSummary";

export default function SelectAddress() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const checkout = searchParams.get("checkout");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let url = id
          ? `https://booknest-3ev5.onrender.com/address/${id}?checkout=${checkout}`
          : `https://booknest-3ev5.onrender.com/address?checkout=${checkout}`;

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        if (!data.success && data.redirectTo) {
          navigate(data.redirectTo);
        } else {
          setAddresses(data.addresses);
          setProduct(data.product || null);
        }
      } catch (err) {
        console.error("Failed to fetch address data:", err);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }

    const addressObj = addresses.find((a) => a._id === selectedAddress);
    if (addressObj) {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    const selectedAddressObj = addresses.find((a) => a._id === selectedAddress);
    return <OrderSummary product={product} selectedAddress={selectedAddressObj} checkout={checkout} />;
  }

  return (
    <>
      <div style={{ marginBottom: '5rem' }}>
        <OrderTracker activeStep={1} />
      </div>
      <div className="address-container">
        <h4>Select a delivery address</h4>
        <h4>Delivery addresses ({addresses.length})</h4>

        <form onSubmit={handleSubmit}>
          {addresses.map((address) => (
            <label className="addresslabel" key={address._id}>
              <input
                type="radio"
                name="selectedAddress"
                value={address._id}
                onChange={() => setSelectedAddress(address._id)}
                required
              />
              <div className="selectAddress">
                <strong>{address.fullName}</strong>
                <br />
                {address.street}, {address.landmark}, {address.city},{" "}
                {address.state}, {address.country}, {address.pincode}
                <br />
                Phone number: {address.phone}
                <br />
                <Link
                  to={`/address/${address._id}/edit?checkout=${checkout}${product ? `&product=${product._id}` : ""}`}
                  style={{ color: "#007185" }}
                >
                  Edit address
                </Link>

              </div>
            </label>
          ))}
          <Link
            to="/address/new"
            style={{ color: "#007185", fontWeight: "bold", display: "block", marginTop: "1rem" }}
          >
            Add a new delivery address
          </Link>

          <br />
          <button type="submit">Deliver to this address</button>
        </form>
      </div>
    </>
  );
}
