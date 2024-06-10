import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IKContext, IKUpload } from "imagekitio-react";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import Header from "./Header";

const UserProfile = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [aadharCardFront, setAadharCardFront] = useState("");
  const [aadharCardBack, setAadharCardBack] = useState("");
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    dob: "",

    gender: "",
    village: "",
    taluka: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  const authenticator = async () => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/user/drivers_document_auth`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Authentication response error text:", errorText); // Log error text from the response
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      const { signature, expire, token } = data;

      return { signature, expire, token };
    } catch (error) {
      console.error("Authentication request failed:", error); // Log any errors caught
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/fetchUserProfileData`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setProfileData(res.data);
        } else {
          alert("Error Fetching Profile Data !");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/fetchUserData`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setUserData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserProfileData();
    fetchUserData();
  }, [decryptedUID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullFormData = {
        ...formData,
        aadharCardFront,
        aadharCardBack,
      };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/user-profile`,
        {
          fullFormData,
          decryptedUID,
        }
      );

      if (res.status === 200) {
        alert("Profile Uploaded");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error submitting data", error);
      alert("Error submitting data");
    }
  };

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

  const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8=";
  const urlEndpoint = "https://ik.imagekit.io/xmzipbjn36";

  return (
    <>
      <div className="container-fluid">
        <Header pageName="User Profile" />
        <div className="container p-4 border rounded-5 border-dark">
          <div className="row">
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  onChange={handleProfileChange}
                  value={profileData.name || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="phone_number">
                  Phone No.
                </label>
                <input
                  type="text"
                  name="phone_number"
                  onChange={handleProfileChange}
                  className="form-control"
                  value={profileData.phone_number || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="email">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  onChange={handleProfileChange}
                  className="form-control"
                  value={profileData.email || ""}
                  readOnly
                />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      className="form-label fw-bolder"
                      htmlFor="aadharCardFront"
                    >
                      Aadhar Card Front:
                    </label>
                    <IKContext
                      publicKey={publicKey}
                      urlEndpoint={urlEndpoint}
                      authenticator={authenticator}
                    >
                      <IKUpload
                        fileName={`${profileData.name}_aadharCardFront.jpg`}
                        className="form-control"
                        tags={["aadhar"]}
                        folder={"/aadharCards"}
                        onSuccess={(result) => {
                          setAadharCardFront(result.url);
                          alert("Uploaded");
                        }}
                        onError={(e) => console.log(e)}
                      />
                    </IKContext>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      className="form-label fw-bolder"
                      htmlFor="aadharCardBack"
                    >
                      Aadhar Card Back:
                    </label>
                    <IKContext
                      publicKey={publicKey}
                      urlEndpoint={urlEndpoint}
                      authenticator={authenticator}
                    >
                      <IKUpload
                        fileName={`${profileData.name}_aadharCardBack.jpg`}
                        className="form-control"
                        tags={["aadhar"]}
                        folder={"/aadharCards"}
                        onSuccess={(result) => {
                          setAadharCardBack(result.url);
                          alert("Uploaded");
                        }}
                        onError={(e) => console.log(e)}
                      />
                    </IKContext>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  {" "}
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="dob">
                      Date of Birth:
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.dob}
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  {" "}
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="gender">
                      Gender:
                    </label>
                    <input
                      type="text"
                      name="gender"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.gender}
                      required
                      placeholder={userData.gender}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="village">
                  Village:
                </label>
                <input
                  type="text"
                  name="village"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.village}
                  required
                  placeholder={userData.village}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="taluka">
                  Taluka:
                </label>
                <input
                  type="text"
                  name="taluka"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.taluka}
                  required
                  placeholder={userData.taluka}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bolder" htmlFor="district">
                  District:
                </label>
                <input
                  type="text"
                  name="district"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.district}
                  required
                  placeholder={userData.district}
                />
              </div>

              <div className="row">
                <div className="col-lg-8">
                  {" "}
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="state">
                      State:
                    </label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.state}
                      required
                      placeholder={userData.state}
                    />
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="pincode">
                      Pincode:
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.pincode}
                      required
                      placeholder={userData.pincode}
                    />
                  </div>
                </div>
              </div>

              <input type="submit" value="Submit" className="btn btn-primary" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
