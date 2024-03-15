import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import HeadphonesPage from "./Pages/Customers/HeadphonesPage";
import secureLocalStorage from "react-secure-storage";
import SuccessPage from "./Pages/Customers/SuccessPage";
import RefreshTokenModal from "./Components/RefreshTokenModal";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {secureLocalStorage.getItem("user_type") === 1 ? (
            ""
          ) : secureLocalStorage.getItem("user_type") === 2 ? (
            <>
              {/* Product pages */}
              <Route path="/headphones" element={<HeadphonesPage />} />

              {/* Extra Pages */}

              <Route path="/success" element={<SuccessPage />} />
            </>
          ) : (
            <>Please Login</>
          )}
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
          <Route path="/refreshToken" element={<RefreshTokenModal />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
