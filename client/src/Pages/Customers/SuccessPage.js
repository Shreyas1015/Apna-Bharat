import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const SuccessPage = () => {
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        console.log("Session Id :", sessionId);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/success`,

          {
            decryptedUID,
            id: sessionId,
          }
        );

        if (response.data.status === "success") {
          setPaymentStatus("Payment was successful!");
        } else {
          setPaymentStatus("Payment failed. Please contact support.");
        }
      } catch (error) {
        console.error("Error handling payment success:", error);
        setPaymentStatus("An error occurred while processing the payment.");
      }
    };

    handlePaymentSuccess();
  }, [decryptedUID, sessionId]);

  const BackToLogin = () => {
    Navigate("/");
  };

  if (!uid) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container-fluid bg-success">
        <div className="container py-5 ">
          <div
            className="card mx-auto success-card-width"
            style={{ width: "30rem" }}
          >
            <div className="card-icon" style={{ height: "50vh" }}>
              <i
                className="fa-solid fa-circle-check fa-beat fa-2xl success-icon"
                style={{
                  color: "#0fe628",
                  fontSize: "13rem",
                  margin: "11rem 8.5rem",
                }}
              ></i>
            </div>
            <div className="card-body text-center">
              <h5 className="card-title fw-bolder mb-3">{paymentStatus}</h5>
              <p className="card-text text-secondary mx-2 mb-3">
                Your payment has been successfully processed. Thank you for your
                purchase!
              </p>
              <a href={`/earpods?uid=${uid}`} className="btn btn-success">
                Back to Home Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
