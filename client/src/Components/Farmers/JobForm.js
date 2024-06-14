import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import Header from "../Header";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";

const JobForm = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [isAadharVisible, setIsAadharVisible] = useState(false);
  const [isKisanCreditVisible, setIsKisanCreditVisible] = useState(false);
  const [aadharCard, setAadharCard] = useState("");
  const [kisanCreditCard, setKisanCreditCard] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    startDate: "",
    endDate: "",
    workingHours: "",
    wageSalary: "",
    qualificationsSkills: "",
    applicationDeadline: "",
    name: "",
    phone_number: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const getFarmerDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchFarmersProfileData`,
          { decryptedUID }
        );
        setFormData({
          jobLocation:
            res.data.village +
            ", " +
            res.data.taluka +
            ", " +
            res.data.district +
            ", " +
            res.data.state +
            ", " +
            res.data.pincode,
          name: res.data.name,
          phone_number: res.data.phone_number,

          email: res.data.email,
        });
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    };

    getFarmerDetails();
  }, [decryptedUID]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullFormData = { ...formData, aadharCard, kisanCreditCard };
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/farmers/farmerJobForm`,

        { fullFormData, decryptedUID }
      );
      if (res.status === 200) {
        alert("Job Posted Successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  const handleViewButtonClick = () => {
    setIsAadharVisible(!isAadharVisible);
    setIsKisanCreditVisible(!isKisanCreditVisible);
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
      <Header pageName="Job Form" />
      <div className="container mt-5 p-5 border border-dark rounded-5 ">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="jobTitle" className="form-label">
              Job Title
            </label>
            <input
              required
              type="text"
              id="jobTitle"
              className="form-control"
              name="jobTitle"
              value={formData.jobTitle || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="jobLocation" className="form-label">
              Job Location
            </label>
            <input
              required
              type="text"
              id="jobLocation"
              className="form-control"
              name="jobLocation"
              value={formData.jobLocation || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="jobDescription" className="form-label">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              className="form-control"
              name="jobDescription"
              value={formData.jobDescription || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              required
              type="date"
              id="startDate"
              className="form-control"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              required
              type="date"
              id="endDate"
              className="form-control"
              name="endDate"
              value={formData.endDate || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="workingHours" className="form-label">
              Working Hours
            </label>
            <input
              required
              type="text"
              id="workingHours"
              className="form-control"
              name="workingHours"
              value={formData.workingHours || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="wageSalary" className="form-label">
              Wage Salary
            </label>
            <input
              required
              type="text"
              id="wageSalary"
              className="form-control"
              name="wageSalary"
              value={formData.wageSalary || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label htmlFor="qualificationsSkills" className="form-label">
              Qualifications & Skills
            </label>
            <input
              required
              type="text"
              id="qualificationsSkills"
              className="form-control"
              name="qualificationsSkills"
              value={formData.qualificationsSkills || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="applicationDeadline" className="form-label">
              Application Deadline
            </label>
            <input
              required
              type="date"
              id="applicationDeadline"
              className="form-control"
              name="applicationDeadline"
              value={formData.applicationDeadline || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="addharCard" className="form-label">
              Addhar Card
            </label>
            <IKContext
              publicKey={publicKey}
              urlEndpoint={urlEndpoint}
              authenticator={authenticator}
            >
              <IKUpload
                fileName={`${formData.name}_aadharCardFront.jpg`}
                className="form-control"
                tags={["aadhar"]}
                folder={"/aadharCards"}
                onSuccess={(result) => {
                  setAadharCard(result.url);
                  alert("Uploaded");
                }}
                onError={(e) => console.log(e)}
              />
              {aadharCard && (
                <>
                  <button
                    onClick={handleViewButtonClick}
                    className="view-button"
                    type="button"
                  >
                    View
                  </button>
                  {isAadharVisible && (
                    <div
                      className="image-preview-backdrop"
                      onClick={handleViewButtonClick}
                    >
                      <div className="image-preview">
                        <IKImage
                          src={aadharCard}
                          alt={`${formData.name} Aadhar Card Front`}
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
          <div className="col-md-6">
            <label htmlFor="kisanCreditCard" className="form-label">
              Kisan Credit Card
            </label>
            <IKContext
              publicKey={publicKey}
              urlEndpoint={urlEndpoint}
              authenticator={authenticator}
            >
              <IKUpload
                fileName={`${formData.name}_kisanCreditCard.jpg`}
                className="form-control"
                tags={["kisanCredit"]}
                folder={"/kisanCreditCards"}
                onSuccess={(result) => {
                  setKisanCreditCard(result.url);

                  alert("Uploaded");
                }}
                onError={(e) => console.log(e)}
              />
              {kisanCreditCard && (
                <>
                  <button
                    onClick={handleViewButtonClick}
                    className="view-button"
                    type="button"
                  >
                    View
                  </button>
                  {isKisanCreditVisible && (
                    <div
                      className="image-preview-backdrop"
                      onClick={handleViewButtonClick}
                    >
                      <div className="image-preview">
                        <IKImage
                          src={kisanCreditCard}
                          alt={`${formData.name} Kisan Credit Card`}
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
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              required
              type="text"
              id="name"
              className="form-control"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              required
              type="text"
              id="phoneNumber"
              className="form-control"
              name="phoneNumber"
              value={formData.phone_number || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              className="form-control"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn blue-buttons">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobForm;
