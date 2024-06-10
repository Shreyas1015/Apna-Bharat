import React from "react";
import UserSidebar from "../../Components/UserSidebar";
import FarmersEquipmentRentalContent from "../../Components/Farmers/FarmersEquipmentRentalContent";
import { useNavigate } from "react-router-dom";

const FarmersEquipmentRentalPage = () => {
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
      <UserSidebar component={<FarmersEquipmentRentalContent />} />
    </div>
  );
};

export default FarmersEquipmentRentalPage;
