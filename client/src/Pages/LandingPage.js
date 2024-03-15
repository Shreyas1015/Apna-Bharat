/* eslint-disable eqeqeq */
import React, { useState } from "react";
import LandingNavbar from "../Components/LandingNavbar";
import LandingCard from "../Components/LandingCard";
import LandingCard2 from "../Components/LandingCard2";
import ProductCard from "../Components/Customers/ProductCard";
import LandingPageCards from "../API/LandingPageCards";
import BlogCard from "../Components/BlogCard";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const isLogin = secureLocalStorage.getItem("isLogin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/customers/subscribers`,
        formData
      );

      if (res.status === 200) {
        alert(res.data.message);
      } else {
        alert(res.data.error);
      }
    } catch (error) {
      console.error("Unable to submit Email : ", error);
      alert("Unable to Submit , Please try again");
    }
  };

  return (
    <>
      <div className="container-fluid m-0 p-0 bg-body-secondary">
        <header>
          <LandingNavbar />
          <div className="container">
            <img
              style={{ width: "100%" }}
              className="object-fit-cover rounded-5 my-3"
              src="/Images/Landing L.png"
              alt=""
            />
            {isLogin == true ? (
              <Link to={`/headphones?uid=${encryptedUID}`}>
                <button className="btn btn-light btn-lg landing-page-img">
                  Shop Now
                </button>
              </Link>
            ) : (
              <button
                className="btn btn-light btn-lg landing-page-img"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please Log In to Access Further");
                }}
              >
                Shop Now
              </button>
            )}
          </div>
        </header>

        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <LandingCard img="/Images/Landing L.png" />
              </div>
              <div className="col-lg-3">
                <LandingCard img="/Images/Landing L.png" />
              </div>
              <div className="col-lg-6">
                <LandingCard img="/Images/Landing L.png" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container my-3">
            <div className="row">
              <div className="col-lg-6">
                <LandingCard img="/Images/Landing L.png" />
              </div>
              <div className="col-lg-3">
                <LandingCard img="/Images/Landing L.png" />
              </div>
              <div className="col-lg-3">
                <LandingCard img="/Images/Landing L.png" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container my-3">
            <div className="row">
              <div className="col-lg-3">
                <LandingCard2 title="icon" para="para" />
              </div>
              <div className="col-lg-3">
                <LandingCard2 title="icon" para="para" />
              </div>
              <div className="col-lg-3">
                <LandingCard2 title="icon" para="para" />
              </div>
              <div className="col-lg-3">
                <LandingCard2 title="icon" para="para" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container my-3">
            <img
              className="img-fluid rounded-5"
              width={"100%"}
              src="/Images/horizontal L.png"
              alt=""
            />
          </div>
        </section>

        <section>
          <div className="container my-3">
            <h2 className="text-center py-5">Best Seller Products</h2>
            <div className="row">
              {LandingPageCards.map((card) => (
                <div className="col-lg-3" key={card.id}>
                  <ProductCard
                    id={card.id}
                    img={card.img}
                    title={card.title}
                    price={card.price}
                    desc={card.desc}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="container my-3">
            <img
              className="img-fluid rounded-5"
              width={"100%"}
              src="/Images/horizontal L.png"
              alt=""
            />
          </div>
        </section>

        <section>
          <div className="container my-3">
            <div className="py-5 text-center">
              <h2>Recent News</h2>
              <p className="text-secondary">Lorem ipsum dolor sit amet.</p>
            </div>

            <div className="row">
              <div className="col-lg-4">
                <BlogCard
                  img="/Images/Headphones.png"
                  dateOfPublish="October 05,2023 by Paul"
                  title="Blog"
                  desc="lorem eifdi fifhihf Lorem ipsum dolor sit amet."
                />
              </div>
              <div className="col-lg-4">
                <BlogCard
                  img="/Images/Headphones.png"
                  dateOfPublish="October 05,2023 by Paul"
                  title="Blog"
                  desc="lorem eifdi fifhihf Lorem ipsum dolor sit amet."
                />
              </div>
              <div className="col-lg-4">
                <BlogCard
                  img="/Images/Headphones.png"
                  dateOfPublish="October 05,2023 by Paul"
                  title="Blog"
                  desc="lorem eifdi fifhihf Lorem ipsum dolor sit amet."
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container-fluid m-0 p-0 my-5">
            <img
              className="img-fluid"
              width={"100%"}
              src="/Images/sponsers.png"
              alt=""
            />
          </div>
        </section>

        <footer>
          <div className="container py-5">
            <div className="row">
              <div className="col-lg-3 px-3">
                <h3>GADGET GROVE</h3>
                <br />
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ullam, ab!
                </p>
                <br />
                <div className="row">
                  <div className="col-lg-3">
                    <i
                      className="fa-brands fa-2xl fa-instagram"
                      style={{ color: "#de1767" }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <i
                      className="fa-brands fa-2xl fa-linkedin"
                      style={{ color: "#1c5ece" }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <i
                      className="fa-regular fa-2xl fa-envelope"
                      style={{ color: "#f23636" }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <i
                      className="fa-brands fa-2xl fa-facebook"
                      style={{ color: "#3772d7" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-2 px-3">
                <h5>Quick Links</h5>
                <br />
                <p>Home</p>
                <p>About Us</p>
                <p>Blog</p>
                <p>Contact Us</p>
              </div>
              <div className="col-lg-3 px-3">
                <h5>Contact</h5>
                <br />
                +9143403334.. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Exercitationem eveniet esse adipisci ullam odit iure!
              </div>
              <div className="col-lg-4 px-3">
                <h5>Subscribe To Our Mail</h5>
                <br />
                <h3>For Latest News & Updates</h3>
                <form onSubmit={handleSubmit}>
                  <div className="input-group my-4">
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      required
                      placeholder="Enter Your Email...."
                      onChange={handleChange}
                      value={formData.email}
                    />
                    <button type="submit" className="btn btn-danger">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
