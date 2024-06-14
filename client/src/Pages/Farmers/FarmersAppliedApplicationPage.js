import React from "react";
import UserSidebar from "../../Components/UserSidebar";
import AppliedApplications from "../../Components/Farmers/AppliedApplications";
import { useNavigate } from "react-router-dom";

const FarmersAppliedApplicationPage = () => {
  const uid = localStorage.getItem("@secure.n.uid");
  const navigate = useNavigate();

  const BackToLogin = () => {
    navigate("/");
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
      <UserSidebar component={<AppliedApplications />} />
    </>
  );
};

export default FarmersAppliedApplicationPage;
