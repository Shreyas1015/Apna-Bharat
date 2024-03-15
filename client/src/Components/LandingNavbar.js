import React from "react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-secondary">
        <div className="container">
          <a className="navbar-brand" href=".">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href=".">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href=".">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href=".">
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href=".">
                  Contact Us
                </a>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-dark" type="submit">
                Search
              </button>
            </form>
            <Link to={"/login"}>
              <button className="btn btn-dark mx-2">
                Login <i className="fa-regular fa-user ms-2" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LandingNavbar;
