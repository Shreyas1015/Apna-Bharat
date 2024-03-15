/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    emailOtp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendLoginEmailVerification`,
        { email: formData.email }
      );

      if (res.data.success) {
        alert("Email verification code sent successfully");
      } else {
        setErrorMessage("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
      alert("User Not Registered");
      setErrorMessage(
        "An error occurred while sending email verification code"
      );
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (res.data.success) {
        alert("Email verified successfully");
      } else {
        setErrorMessage("Failed to verify Email Otp");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
      setErrorMessage("Invalid Otp");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOtp) {
      setErrorMessage("Please enter both email and phone OTPs");
      return;
    }

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        setErrorMessage("Email OTP verification failed");
        return;
      }

      const loginRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          email: formData.email,
        }
      );

      const userId = loginRes.data.uid;
      const userType = loginRes.data.user_type;
      const isLogin = loginRes.data.isLogin;

      secureLocalStorage.setItem("uid", userId);
      secureLocalStorage.setItem("user_type", userType);
      secureLocalStorage.setItem("isLogin", isLogin);

      const encryptedUID = localStorage.getItem("@secure.n.uid");
      const decryptedUserType = secureLocalStorage.getItem("user_type");

      if (decryptedUserType === 1) {

        navigate(`/customer-dashboard?uid=${encryptedUID}`);
      } else if (decryptedUserType === 2) {

        navigate(`/seller-dashboard?uid=${encryptedUID}`);
      } else if (decryptedUserType === 3) {

        navigate(`/admin-dashboard?uid=${encryptedUID}`);
      }
      alert("Logged In Successfully");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during login.");
      }
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 ">
        <div className="row min-vh-100">
          <img
            className="object-fit-cover position-absolute z-n1 m-0 p-0"
            src="/Images/login&signup_image.png"
            alt=""
            style={{ height: "100vh" }}
          />
          <div className="col-lg-6 m-0 p-0"></div>
          <div className="col-lg-6 m-0 p-0">
            <form
              className="bg-light login-container mx-auto rounded-4"
              onSubmit={handleSubmit}
            >
              <div className="text-center login-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Login</h1>
                <i>"!!"</i>
              </div>
              <div className="form-container pb-4 mx-auto">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="name@gmail.com"
                      required
                      onChange={handleChange}
                      value={formData.email}
                    />
                    <button
                      className="btn btn-sm"
                      type="button"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      onClick={handleEmailVerification}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="emailOtp" className="form-label">
                    Email OTP:
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="emailOtp"
                      name="emailOtp"
                      className="form-control"
                      value={formData.emailOtp}
                      placeholder="Enter your OTP here"
                      onChange={handleChange}
                      required
                    />

                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      type="button"
                      onClick={confirmEmailVerification}
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
                <div className="mb-1">
                  <h5 className="text-danger">{errorMessage}</h5>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6">
                    <input
                      className="btn px-4 py-2"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      type="submit"
                      value="Login"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/signup">
                  Don't Have An Account ? SignUp Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
