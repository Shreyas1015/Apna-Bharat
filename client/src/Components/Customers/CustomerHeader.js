import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { Link, useNavigate } from "react-router-dom";

const CustomerHeader = (props) => {
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");

  useEffect(() => {
    const fetchTotalNumberOfCartItems = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchTotalNumberOfCartItems`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setTotalItems(res.data);
          console.log(res.data);
        } else {
          alert("Error Fetching Headphones Data !");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalNumberOfCartItems();
  }, [decryptedUID]);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        secureLocalStorage.removeItem("uid");
        secureLocalStorage.removeItem("isLogin");
        secureLocalStorage.removeItem("user_type");

        navigate("/");
        alert("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-9">
          <h2>{props.pageName}</h2>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className="col-lg-3 px-auto">
              <Link to={`/wishlist?uid=${encryptedUID}`}>
                <button
                  type="button"
                  className="btn border border-dark border-1 mx-auto my-1"
                >
                  <i
                    className="fa-regular fa-heart fa-xl"
                    style={{ color: "#292929" }}
                  />
                </button>
              </Link>
            </div>
            <div className="col-lg-3 px-auto">
              <Link to={`/shoppingcart?uid=${encryptedUID}`}>
                <button
                  type="button"
                  className="btn border border-dark border-1 position-relative screen-set mx-auto my-1"
                >
                  <i
                    className="fa-sharp fa-solid fa-cart-shopping fa-xl"
                    style={{ color: "#292929" }}
                  ></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                  </span>
                </button>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="btn btn-outline-dark mt-1" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" />
                <span> Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default CustomerHeader;
