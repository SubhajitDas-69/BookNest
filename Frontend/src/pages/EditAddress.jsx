import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import AlertMessage from '../component/AlertMessage';

export default function EditAddress() {
  const [alert, setAlert] = useState({ msg: '', severity: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const checkout = searchParams.get("checkout");
  const product = searchParams.get("product");

  const [address, setAddress] = useState({
    country: "", fullName: "", phone: "", pincode: "",
    state: "", city: "", landmark: "", street: ""
  });

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await fetch(`https://booknest-3ev5.onrender.com/address/${id}/edit`, {
          credentials: "include",
          method: "GET"
        });
        const data = await res.json();
        if (data.success) {
          setAddress(data.address);
        } else {
          setAlert({ msg: "Failed to load address", severity: "error" });
          navigate("/address");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setAlert({ msg: "Error fetching address", severity: "error" });
      }
    }
    fetchAddress();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`https://booknest-3ev5.onrender.com/address/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ address }),
    });

    const data = await res.json();
    if (data.success) {
      setAlert({ msg: data.message, severity: "success" });
      
      let redirectUrl = "/address";
      if (checkout === "buyNow" && product) {
        redirectUrl += `/${product}?checkout=buyNow`;
      } else if (checkout === "fromCart") {
        redirectUrl += `?checkout=fromCart`;
      }

      navigate(redirectUrl);
    } else {
      setAlert({ msg: data.message, severity: "error" });
    }
  };

  return (
    <div className="newForm col-6">
      <AlertMessage alert={alert} setAlert={setAlert} />
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="mb-3">
          <label htmlFor="country" className="form-label">Country/Region</label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Country name should be valid</div>
        </div>

        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full name</label>
          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Enter your full name</div>
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Mobile number</label>
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Please enter your phone no.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Please enter your pin</div>
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="state" className="form-label">State</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">State name should be valid</div>
        </div>

        <div className="mb-3 col-md-6">
          <label htmlFor="city" className="form-label">Town/City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">City name should be valid</div>
        </div>

        <div className="mb-3">
          <label htmlFor="landmark" className="form-label">Landmark</label>
          <textarea
            rows="2"
            cols="40"
            name="landmark"
            value={address.landmark}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
          <div className="invalid-feedback">Please enter your landmark</div>
        </div>

        <div className="mb-3">
          <label htmlFor="street" className="form-label">Street</label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Please enter your street name</div>
        </div>

        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </div>
  );
}
