import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import secureLocalStorage from "react-secure-storage";
import SuccessPage from "./Pages/Customers/SuccessPage";
import RefreshTokenModal from "./Components/RefreshTokenModal";
import CustomerDashboard from "./Pages/Customers/CustomerDashboard";
import SellerDashboard from "./Pages/Sellers/SellerDashboard";
import AdminDashboard from "./Pages/Admins/AdminDashboard";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {secureLocalStorage.getItem("user_type") === 1 ? (
            <>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            </>
          ) : secureLocalStorage.getItem("user_type") === 2 ? (
            <>
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/success" element={<SuccessPage />} />
            </>
          ) : secureLocalStorage.getItem("user_type") === 3 ? (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </>
          ) : <>Please Login</>}
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
          <Route path="/refreshToken" element={<RefreshTokenModal />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
