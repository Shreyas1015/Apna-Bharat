import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    emailOtp: "",
    phoneOtp: "",
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
        `${process.env.REACT_APP_BASE_URL}/auth/sendEmailVerification`,
        { email: formData.email }
      );

      if (res.data.success) {
        alert("Email verification code sent successfully");
      } else {
        setErrorMessage("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
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

  // const handlePhoneVerification = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/auth/sendPhoneVerification`,
  //       { phone: formData.phone_number }
  //     );

  //     if (res.data.success) {
  //       alert("Phone verification code sent successfully");
  //     } else {
  //       setErrorMessage("Failed to send phone verification code");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMessage(
  //       "An error occurred while sending phone verification code"
  //     );
  //   }
  // };

  const handleSignupWithVerification = async (e) => {
    e.preventDefault();

    if (!formData.emailOtp) {
      setErrorMessage("Please enter email OTPs");
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

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signup_with_verification`,
        formData
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      alert("Signed Up Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during sign up.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100">
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
              className="bg-light signup-container mx-auto rounded-4"
              onSubmit={handleSignupWithVerification}
            >
              <div className="text-center signup-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Sign Up</h1>
                <i>"="</i>
              </div>
              <div className="form-container pb-4 mx-auto">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Enter Your Name"
                        required
                        onChange={handleChange}
                        value={formData.name}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
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
                  <div className="col-lg-6 mb-3">
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
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone_number"
                        className="form-control"
                        id="phone_number"
                        placeholder="Enter your phone number"
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && value.length <= 10)
                          ) {
                            handleChange(e);
                          }
                        }}
                        value={formData.phone_number}
                      />
                      {/* <button
                    className="btn btn-outline-secondary"
                    type="button"
                    // onClick={handlePhoneVerification}
                  >
                    Send Phone OTP
                  </button> */}
                    </div>
                  </div>
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="phoneOtp" className="form-label">
                    Phone OTP:
                  </label>
                  <input
                    type="text"
                    id="phoneOtp"
                    name="phoneOtp"
                    className="form-control"
                    value={formData.phoneOtp}
                    placeholder="Enter your phone OTP here"
                    onChange={handleChange}
                    required
                  />
                </div> */}
                <div className="mb-1">
                  <h5 className="text-danger">
                    {errorMessage && (
                      <div className="error">{errorMessage}</div>
                    )}

                    {successMessage && (
                      <div className="success">{successMessage}</div>
                    )}
                  </h5>
                </div>
                <br />

                <input
                  className="btn px-4 py-2"
                  style={{ backgroundColor: "#0bbfe0", color: "white" }}
                  type="submit"
                  value="Sign Up"
                />
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/">
                  Already Have An Account ? Login Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
