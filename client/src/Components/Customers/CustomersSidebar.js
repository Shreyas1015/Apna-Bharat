import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomersSidebar = (props) => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const [isOpen, setIsOpen] = useState(true);

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

  const handleTrigger = () => setIsOpen(!isOpen);

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

          <Link className="text-decoration-none" to={`/earpods?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "whitesmoke" }}
                className="fa-solid fa-user "
              ></i>
              <span> Earpods</span>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
};

export default CustomersSidebar;
