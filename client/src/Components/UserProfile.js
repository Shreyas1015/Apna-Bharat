import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import Header from "./Header";

const UserProfile = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [aadharCardFront, setAadharCardFront] = useState("");
  const [aadharCardBack, setAadharCardBack] = useState("");
  const [profileIMG, setProfileIMG] = useState("");
  const [previousEmail, setPreviousEmail] = useState("");
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
  const [isImageVisible, setIsImageVisible] = useState(false);

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
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/fetchUserProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    const fetchProfileIMG = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/fetchUserProfileIMG`,
          { decryptedUID }
        );

        setUpdatedProfileIMG(response.data.link);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/fetchUserData`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setFormData(res.data);
          setAadharCardBack(res.data.aadharcardback);
          setAadharCardFront(res.data.aadharcardfront);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
    fetchProfileIMG();
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

  const handleViewButtonClick = () => {
    setIsImageVisible(!isImageVisible);
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/farmers/sendProfileUpdateEmailVerification`,
        { decryptedUID }
      );

      setPreviousEmail(res.data.email);
      if (res.data.success) {
        alert(
          "Email verification code sent successfully to the email you previously registered with"
        );
      } else {
        setErrorMessage("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "An error occurred while sending email verification code"
      );
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: profileData.emailOtp,
        }
      );

      if (res.data.success) {
        alert("Email verified successfully");
      } else {
        setErrorMessage("Failed to verify Email Otp");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
      setErrorMessage("Invalid Otp");
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/farmers/drivers_document_auth`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      console.log("Authentication parameters:", { signature, expire, token });
      return { signature, expire, token };
    } catch (error) {
      console.error(`Authentication request failed: ${error.message}`);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: profileData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        setErrorMessage("Email OTP verification failed");
        return;
      }

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/updateUsersProfile`,
        { profileData, decryptedUID }
      );

      if (res.status === 200) {
        if (profileData.email !== previousEmail) {
          alert(
            "Profile has been updated. Please login again with your updated email."
          );
          window.localStorage.removeItem("@secure.n.user_type");
          window.localStorage.removeItem("@secure.n.uid");
          navigate("/");
        } else {
          alert("Profile is Updated Successfully");
          window.location.reload();
        }
      } else {
        console.error("Error updating profile");
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProfileImg = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        profile_img: profileIMG,
        uid: decryptedUID,
      };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/uploadUserProfileImage`,
        { formData, decryptedUID }
      );

      if (res.status === 200) {
        console.log("Profile Image uploaded!");
        alert("Profile Image uploaded!");
        window.location.reload();
      } else {
        console.error("Error uploading Profile Image");
        alert("An error occurred while uploading your Profile Image.");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
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

  const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  return (
    <>
      <div className="container-fluid">
        <Header pageName="User Profile" />
        <div className="profile-div mb-4 p-3 border  border-dark border-1 rounded-5">
          <div className="row my-5">
            <div className="col-lg-3 border-end border-dark border-2 text-center">
              <img
                className="img-fluid profile-img"
                src={updatedProfileIMG}
                alt="Not available"
              />
              <form onSubmit={handleProfileImg}>
                <input type="hidden" name="uid" value={decryptedUID} />
                <div className="input-group me-5 py-3">
                  <IKContext
                    publicKey={publicKey}
                    urlEndpoint={urlEndpoint}
                    authenticator={authenticator}
                  >
                    <IKUpload
                      required
                      className="form-control"
                      fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
                      folder="Home/Tripto/passengers"
                      tags={["tag1"]}
                      useUniqueFileName={true}
                      isPrivateFile={false}
                      onSuccess={(r) => {
                        setProfileIMG(r.url || "");
                        alert("Uploaded");
                      }}
                      onError={(e) => console.log(e)}
                    />
                  </IKContext>
                  <input
                    type="submit"
                    className="input-group-text blue-buttons"
                    value="Edit"
                  />
                </div>
              </form>
            </div>
            <div className="col-lg-9 p-4 ">
              <form onSubmit={handleProfileEdit}>
                <input type="hidden" name="uid" value={decryptedUID} />

                <div className="input-group mb-4">
                  <span className="input-group-text">Name</span>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    required
                    value={profileData.name || ""}
                    placeholder={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="input-group mb-4">
                      <span className="input-group-text">Email</span>
                      <input
                        name="email"
                        type="text"
                        className="form-control"
                        required
                        value={profileData.email || ""}
                        placeholder={profileData.email}
                        onChange={handleProfileChange}
                      />
                      <button
                        className="btn btn-sm"
                        type="button"
                        style={{ backgroundColor: "#0bbfe0", color: "white" }}
                        onClick={handleEmailVerification}
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="input-group">
                      <input
                        type="text"
                        id="emailOtp"
                        name="emailOtp"
                        className="form-control"
                        value={profileData.emailOtp || ""}
                        placeholder="Enter your OTP here"
                        onChange={handleProfileChange}
                        required
                      />

                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#0bbfe0", color: "white" }}
                        type="button"
                        onClick={confirmEmailVerification}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                </div>

                <div className="input-group mb-4">
                  <span className="input-group-text">Phone Number</span>
                  <input
                    name="phone_number"
                    type="text"
                    className="form-control"
                    required
                    value={profileData.phone_number || ""}
                    placeholder={profileData.phone_number}
                    onChange={handleProfileChange}
                  />
                </div>

                <br />
                <input
                  type="submit"
                  value="Edit Profile"
                  className="form-control blue-buttons mt-4"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="container p-4 border rounded-5 border-dark">
          <div className="row">
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
                      {aadharCardFront && (
                        <>
                          <button
                            onClick={handleViewButtonClick}
                            className="view-button"
                            type="button"
                          >
                            View
                          </button>
                          {isImageVisible && (
                            <div
                              className="image-preview-backdrop"
                              onClick={handleViewButtonClick}
                            >
                              <div className="image-preview">
                                <IKImage
                                  src={aadharCardFront}
                                  alt={`${profileData.name} Aadhar Card Front`}
                                  transformation={[
                                    {
                                      height: 500,
                                      width: 500,
                                      quality: 90,
                                    },
                                  ]}
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
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
                      {aadharCardBack && (
                        <>
                          <button
                            onClick={handleViewButtonClick}
                            className="view-button"
                            type="button"
                          >
                            View
                          </button>
                          {isImageVisible && (
                            <div
                              className="image-preview-backdrop"
                              onClick={handleViewButtonClick}
                            >
                              <div className="image-preview">
                                <IKImage
                                  src={aadharCardBack}
                                  alt={`${profileData.name} Aadhar Card Back`}
                                  transformation={[
                                    {
                                      height: 500,
                                      width: 500,
                                      quality: 90,
                                    },
                                  ]}
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </IKContext>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="dob">
                      Date of Birth:
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      onChange={handleChange}
                      value={formatDate(formData.dob) || ""}
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
                      value={formData.gender || ""}
                      required
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
                  value={formData.village || ""}
                  required
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
                  value={formData.taluka || ""}
                  required
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
                  value={formData.district || ""}
                  required
                />
              </div>

              <div className="row">
                <div className="col-lg-8">
                  <div className="mb-3">
                    <label className="form-label fw-bolder" htmlFor="state">
                      State:
                    </label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.state || ""}
                      required
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
                      value={formData.pincode || ""}
                      required
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
