import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import { useNavigate } from "react-router-dom";
import HeadphonesContent from "../../Components/Customers/CustomerDashboardContent";

const SellerDashboard = () => {
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
            <CustomersSidebar component={<HeadphonesContent />} />
        </>
    );
};

export default SellerDashboard;
