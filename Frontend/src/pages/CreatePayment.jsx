import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import AlertMessage from '../component/AlertMessage';
export default function CreatePayment() {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ msg: '', severity: '' });
  const { orderId } = useParams();
  useEffect(() => {
    async function redirectToRazorpay() {
      try {
        const res = await fetch(`https://booknest-cnfb.onrender.com/payment/${orderId}/create-payment-link`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.paymentLink) {
          window.location.href = data.paymentLink;
        } else {
          setAlert({ msg: "Failed to get payment link", severity: "error" });
        }
      } catch (err) {
        console.error("Error creating payment link:", err);
        setAlert({ msg: "Payment link creation failed.", severity: "error" });
      } finally {
        setLoading(false);
      }
    }

    redirectToRazorpay();
  }, [orderId]);

  return (
    <>
    <AlertMessage alert={alert} setAlert={setAlert} />
      {loading && (
            <div className="LoaderContainer">
              <div className="Loader">
                <CircularProgress />
              </div>
            </div>
        )}
    </>

  )

}
