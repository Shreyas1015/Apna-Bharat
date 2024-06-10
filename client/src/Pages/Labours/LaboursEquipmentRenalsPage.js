import React from "react";
import LaboursEquipmentRenalsContent from "../../Components/Labours/LaboursEquipmentRenalsContent";
import UserSidebar from "../../Components/UserSidebar";
import { useNavigate } from "react-router-dom";

const LaboursEquipmentRenalsPage = () => {
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
    <div>
      <UserSidebar component={<LaboursEquipmentRenalsContent />} />
    </div>
  );
};

export default LaboursEquipmentRenalsPage;
