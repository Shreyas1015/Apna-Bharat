import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const LaboursProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [addressData, setAddressData] = useState({
    village: "",
    taluka: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [updatedAddressData, setUpdatedAddressData] = useState({
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
  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    skills: "",
    qualifications: "",
    experience: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchFarmersProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
          setUpdatedProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    const fetchAddressData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchFarmersAddress`,
          { decryptedUID }
        );
        setAddressData(res.data);
        setUpdatedAddressData(res.data);
      } catch (error) {
        console.error("Error fetching Address Data:", error.message);
      }
    };

    const fetchAdditionalInfo = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/labours/fetchLaboursAdditionalInfo`,
          { decryptedUID }
        );
        setAdditionalInfo(res.data);
      } catch (error) {
        console.error("Error fetching Additional Info:", error.message);
      }
    };
    fetchProfileData();
    fetchAddressData();
    fetchAdditionalInfo();
  }, [decryptedUID]);

  const BackToLogin = () => {
    navigate("/");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdditionalInfoEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/labours/updateFarmersAdditionalInfo`,
        { decryptedUID, additionalInfo }
      );
      if (res.status === 200) {
        alert("Additional Info Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating Additional Info:", error.message);
      alert("Error updating Additional Info");
    }
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

  return (
    <div>
      <Header pageName="Profile" />
      <div className="profile-div mb-4 border border-dark p-3 rounded-5">
        <div className="input-group mb-4">
          <span className="input-group-text">Name</span>
          <input
            name="name"
            type="text"
            className="form-control"
            required
            value={updatedProfileData.name || ""}
            readOnly
            onChange={handleProfileChange}
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">Email</span>
          <input
            name="email"
            type="text"
            className="form-control"
            required
            value={updatedProfileData.email || ""}
            readOnly
            onChange={handleProfileChange}
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">Phone Number</span>
          <input
            name="phone_number"
            type="text"
            className="form-control"
            required
            value={updatedProfileData.phone_number || ""}
            readOnly
            onChange={handleProfileChange}
          />
        </div>
      </div>
      <div className="additional-info mb-4 ">
        <h2 className="border border-dark p-3 rounded-5 mb-4">
          Additional Information
        </h2>
        <div className="container-fluid p-3 border  border-dark border-1 rounded-5">
          <form onSubmit={handleAdditionalInfoEdit}>
            <div className="row ">
              <div className="mb-3 col-lg-6">
                <label htmlFor="skills" className="form-label">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  className="form-control"
                  value={additionalInfo.skills || ""}
                  onChange={handleAdditionalInfoChange}
                  id="skills"
                />
              </div>
              <div className="mb-3 col-lg-6">
                <label htmlFor="qualifications" className="form-label">
                  Qualifications
                </label>
                <input
                  type="text"
                  name="qualifications"
                  className="form-control"
                  value={additionalInfo.qualifications || ""}
                  onChange={handleAdditionalInfoChange}
                  id="qualifications"
                />
              </div>
              <div className="mb-3 col-lg-6">
                <label htmlFor="experience" className="form-label">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={additionalInfo.experience || ""}
                  onChange={handleAdditionalInfoChange}
                  id="experience"
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary form-control">
                  submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="address-div mb-4 ">
        <h2 className="p-3 border  border-dark border-1 rounded-5 mb-4">
          Address
        </h2>
        <div className="container-fluid p-3 border  border-dark border-1 rounded-5">
          <div className="row g-3 ">
            <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label">
                Village
              </label>
              <input
                type="text"
                name="village"
                value={updatedAddressData.village || ""}
                placeholder={addressData.village}
                onChange={handleAddressChange}
                className="form-control"
                id="inputEmail4"
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPassword4" className="form-label">
                Taluka
              </label>
              <input
                type="text"
                name="taluka"
                value={updatedAddressData.taluka || ""}
                onChange={handleAddressChange}
                placeholder={addressData.taluka}
                className="form-control"
                id="inputPassword4"
                readOnly
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">
                District
              </label>
              <input
                type="text"
                name="district"
                value={updatedAddressData.district || ""}
                onChange={handleAddressChange}
                placeholder={addressData.district}
                className="form-control"
                id="inputAddress"
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="inputState" className="form-label">
                State
              </label>
              <input
                type="text"
                id="inputState"
                className="form-select"
                placeholder={addressData.state}
                name="state"
                value={updatedAddressData.state || ""}
                onChange={handleAddressChange}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="inputZip" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={updatedAddressData.pincode || ""}
                onChange={handleAddressChange}
                placeholder={addressData.pincode}
                className="form-control"
                id="inputZip"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboursProfileContent;
