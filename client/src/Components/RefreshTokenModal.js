import React, { useState } from "react";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const RefreshTokenModal = () => {
  const [password, setPassword] = useState("");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/refresh`,
        { password, decryptedUID }
      );

      if (response.status === 200) {
        console.log(response.data);
        navigate("/wishlist");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <button type="button" className="btn btn-secondary">
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Refresh Token
          </button>
        </div>
      </form>
    </>
  );
};

export default RefreshTokenModal;
