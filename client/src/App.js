import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import RefreshTokenModal from "./Components/RefreshTokenModal";
import UserProfilePage from "./Pages/UserProfilePage";
import Loading from "./Components/Loading";
import { useEffect, useState } from "react";
import axiosInstance from "./API/axiosInstance";
import FarmersProfilePage from "./Pages/Farmers/FarmersProfilePage";
import FarmersJobPostingPage from "./Pages/Farmers/FarmersJobPostingPage";
import FarmersProductsSalePage from "./Pages/Farmers/FarmersProductsSalePage";
import FarmersMarketSalesPage from "./Pages/Farmers/FarmersMarketSalesPage";
import FarmersEquipmentRentalPage from "./Pages/Farmers/FarmersEquipmentRentalPage";
import LaboursProfilePage from "./Pages/Labours/LaboursProfilePage";
import LaboursJobListingPage from "./Pages/Labours/LaboursJobListingPage";
import LaboursEquipmentRenalsPage from "./Pages/Labours/LaboursEquipmentRenalsPage";
import ResidentReportIssuePage from "./Pages/Residents/ResidentReportIssuePage";

const App = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request Interceptor
    axiosInstance.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <>
      <Router>
        <Loading show={loading} />
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/signup" element={<SignUpPage />} />
          {/* User Section */}
          <Route path="/user-profile" element={<UserProfilePage />} />
          <>
            {/* Farmer */}
            <Route
              path="/farmers/farmers-profile"
              element={<FarmersProfilePage />}
            />
            <Route
              path="/farmers/farmers-job-posting"
              element={<FarmersJobPostingPage />}
            />
            <Route
              path="/farmers/farmers-products-sale"
              element={<FarmersProductsSalePage />}
            />
            <Route
              path="/farmers/farmers-market-sales"
              element={<FarmersMarketSalesPage />}
            />
            <Route
              path="/farmers/farmers-equipment-rental"
              element={<FarmersEquipmentRentalPage />}
            />

            {/* Labour */}
            <Route
              path="/labours/labours-profile"
              element={<LaboursProfilePage />}
            />
            <Route
              path="/labours/labours-job-listing"
              element={<LaboursJobListingPage />}
            />
            <Route
              path="/labours/labours-equipment-rentals"
              element={<LaboursEquipmentRenalsPage />}
            />

            {/* Resident */}

            <Route
              path="/residents/residents-report-issue"
              element={<ResidentReportIssuePage />}
            />
          </>

          {/* Admin Section */}
          <>{/* Admin */}</>

          <Route path="/refreshToken" element={<RefreshTokenModal />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
