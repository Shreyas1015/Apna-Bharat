import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const UserSidebar = (props) => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [isOpen, setIsOpen] = useState(true);
  const [userProfileExists, setUserProfileExists] = useState(false);
  const [labourersOpen, setLabourersOpen] = useState(false);
  const [farmersOpen, setFarmersOpen] = useState(false); // New state for Farmers accordion
  const [residentsOpen, setResidentsOpen] = useState(false); // New state for Residents accordion

  useEffect(() => {
    const checkUserProfile = async () => {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/checkUserProfile`,
        { decryptedUID }
      );

      if (parseInt(res.data) === 0) {
        setUserProfileExists(false);
      } else {
        setUserProfileExists(true);
      }
    };

    checkUserProfile();
  }, [decryptedUID]);

  const BackToLogin = () => {
    navigate("/");
  };

  const handleTrigger = () => setIsOpen(!isOpen);
  const toggleLabourers = () => setLabourersOpen(!labourersOpen);
  const toggleFarmers = () => setFarmersOpen(!farmersOpen);
  const toggleResidents = () => setResidentsOpen(!residentsOpen);

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
      <div className="page">
        <div className="row container-fluid m-0 p-0">
          <div className={`col-lg-${isOpen ? "2" : "1"} transition-col`}></div>
          <div className={`col-lg-${isOpen ? "10" : "11"} transition-col`}>
            <div className="content py-3 container-fluid">
              {props.component}
            </div>
          </div>
        </div>

        <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
          <div
            style={{ color: "whitesmoke" }}
            className="trigger"
            onClick={handleTrigger}
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>

          <Link
            className="text-decoration-none"
            to={`/user-profile?uid=${uid}`}
          >
            <div className="sidebar-position">
              <i
                style={{ color: "whitesmoke" }}
                className="fa-solid fa-user"
              ></i>
              <span> User Profile</span>
            </div>
          </Link>
          {userProfileExists ? (
            <>
              <div className="sidebar-position" onClick={toggleFarmers}>
                <i
                  style={{ color: "whitesmoke" }}
                  className="fa-solid fa-user"
                ></i>
                <span> Farmers </span>
              </div>
              {farmersOpen && (
                <div className="sidebar-submenu">
                  <button
                    onClick={() =>
                      navigate(`/farmers/farmers-profile?uid=${uid}`)
                    }
                  >
                    Profile
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/farmers/farmers-job-posting?uid=${uid}`)
                    }
                  >
                    Job Posting
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/farmers/farmers-equipment-rental?uid=${uid}`)
                    }
                  >
                    Equipment Rentals
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/farmers/farmers-products-sale?uid=${uid}`)
                    }
                  >
                    Product Sales
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/farmers/farmers-market-sales?uid=${uid}`)
                    }
                  >
                    Market Rates
                  </button>
                </div>
              )}

              <div className="sidebar-position" onClick={toggleResidents}>
                <i
                  style={{ color: "whitesmoke" }}
                  className="fa-solid fa-user"
                ></i>
                <span> Resident </span>
              </div>
              {residentsOpen && (
                <div className="sidebar-submenu">
                  <button
                    onClick={() =>
                      navigate(`/residents/residents-report-issue?uid=${uid}`)
                    }
                  >
                    Report issue
                  </button>
                </div>
              )}

              <div className="sidebar-position" onClick={toggleLabourers}>
                <i
                  style={{ color: "whitesmoke" }}
                  className="fa-solid fa-user"
                ></i>
                <span> Labourers </span>
              </div>
              {labourersOpen && (
                <div className="sidebar-submenu">
                  <button
                    onClick={() =>
                      navigate(`/labours/labours-profile?uid=${uid}`)
                    }
                  >
                    Profile
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/labours/labours-job-listing?uid=${uid}`)
                    }
                  >
                    Job Listings
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/labours/labours-equipment-rentals?uid=${uid}`)
                    }
                  >
                    Equipment Rentals
                  </button>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
