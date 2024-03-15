import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/forget_password`,
        { email }
      );
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        alert(response.data.message);
      }
      navigate("/resetPass", { state: { email } });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while requesting password reset.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-6 m-0 p-0"></div>
        <div className="col-lg-6 m-0 p-0">
          <form
            className="glassomorphic-effect login-container mx-auto rounded-4"
            onSubmit={handleForgotPassword}
          >
            <div className="text-center login-text pt-4 mx-auto mb-5">
              <h1 className="text-dark mb-3">Forgot Password</h1>
            </div>
            <div className="form-container pb-4 mx-auto">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="name@gmail.com"
                  required
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>

              {errorMessage && <div className="error">{errorMessage}</div>}
              {successMessage && (
                <div className="success">{successMessage}</div>
              )}
              <br />
              <div className="col-lg-6">
                <input
                  className="btn px-4 py-2"
                  style={{ backgroundColor: "#62c1bf", color: "white" }}
                  type="submit"
                  value="Send OTP"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
