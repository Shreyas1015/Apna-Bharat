import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const LaboursProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

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
  const [additionalInfo, setAdditionalInfo] = useState({
    skills: "",
    qualification: "",
    experience: "",
  });
  const [jobData, setJobData] = useState([]);

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

    const fetchAddressData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchFarmersAddress`,
          { decryptedUID }
        );

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

    const fetchPersonalJobDataStatus = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/labours/fetchPersonalJobDataStatus`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setJobData(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileData();
    fetchAddressData();
    fetchAdditionalInfo();
    fetchPersonalJobDataStatus();
  }, [decryptedUID]);

  const BackToLogin = () => {
    navigate("/");
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
            value={profileData.name || ""}
            readOnly
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">Email</span>
          <input
            name="email"
            type="text"
            className="form-control"
            required
            value={profileData.email || ""}
            readOnly
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">Phone Number</span>
          <input
            name="phone_number"
            type="text"
            className="form-control"
            required
            value={profileData.phone_number || ""}
            readOnly
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
                  name="qualification"
                  className="form-control"
                  value={additionalInfo.qualification || ""}
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
                name="state"
                value={updatedAddressData.state || ""}
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
                className="form-control"
                id="inputZip"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="job-status mb-4">
        <h2 className="p-3 border  border-dark border-1 rounded-5 mb-4">
          Applied Jobs Status
        </h2>
        <div className="container-fluid p-3 border  border-dark border-1 rounded-5 mb-4">
          <table className="table table-bordered  table-responsive">
            <thead className="text-center">
              <tr>
                <th scope="col">Sr No.</th>
                <th scope="col">Job Title</th>
                <th scope="col">Status</th>
                <th scope="col">Applied Date</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {jobData.map((job, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{job.jobtitle}</td>
                  <td>
                    {job.job_status === 0
                      ? "Pending"
                      : job.job_status === 1
                      ? "Applied"
                      : job.job_status === 2
                      ? "Accepted"
                      : "Rejected"}
                  </td>
                  <td>{new Date(job.applied_date).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaboursProfileContent;
