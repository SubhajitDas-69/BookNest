import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function NewAddress() {
  const [searchParams] = useSearchParams();
  const checkout = searchParams.get("checkout");
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    country: "",
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    landmark: "",
    street: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://booknest-3ev5.onrender.com/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (res.ok && data.redirectTo) {
        let queryString = "";
        if (productId) {
          queryString += `/${productId}`;
        }
        if (checkout) {
          queryString += `?checkout=${checkout}`;

        }
        navigate(`${data.redirectTo}${queryString}`);

      } else {
        alert(data.message || "Failed to save address.");
      }
    } catch (err) {
      console.error("Failed to submit address:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="newForm col-6">
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">Country/Region</label>
          <input
            type="text"
            placeholder="Your Country/Region"
            name="country"
            className="form-control"
            required
            value={address.country}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            name="fullName"
            className="form-control"
            required
            value={address.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile number</label>
          <input
            type="number"
            name="phone"
            className="form-control"
            required
            value={address.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pincode</label>
          <input
            type="number"
            name="pincode"
            className="form-control"
            required
            value={address.pincode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            required
            value={address.state}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">Town/City</label>
          <input
            type="text"
            name="city"
            className="form-control"
            required
            value={address.city}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Landmark</label>
          <textarea
            rows="2"
            cols="40"
            name="landmark"
            className="form-control"
            required
            value={address.landmark}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            type="text"
            name="street"
            className="form-control"
            required
            value={address.street}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
