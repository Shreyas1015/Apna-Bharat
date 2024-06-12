import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";

const JobDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jid = new URLSearchParams(location.search).get("edit");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [isAadharVisible, setIsAadharVisible] = useState(false);
  const [isKisanCreditVisible, setIsKisanCreditVisible] = useState(false);
  const [aadharCard, setAadharCard] = useState("");
  const [kisanCreditCard, setKisanCreditCard] = useState("");
  const [job, setJob] = useState({
    jobtitle: "",
    joblocation: "",
    jobdescription: "",
    startdate: "",
    enddate: "",
    workinghours: "",
    wagesalary: "",
    qualificationsskills: "",
    applicationdeadline: "",
    name: "",
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    const fetchParticularJobDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchParticularJobDetails`,
          {
            decryptedUID,
            jid,
          }
        );
        if (res.status === 200) {
          setJob(res.data);
          setAadharCard(res.data.aadharcard);
          setKisanCreditCard(res.data.kissancard);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchParticularJobDetails();
  }, [decryptedUID, jid]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/farmers/updateJobDetails`,
        { decryptedUID, jid, job }
      );
      if (res.status === 200) {
        alert("Job details updated successfully");
        navigate(`/farmers/farmers-job-posting?uid=${encryptedUID}`);
      }
    } catch (error) {
      console.error("Failed to update job details", error);
      alert("Failed to update job details");
    }
  };

  const authenticator = async () => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/user/drivers_document_auth`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Authentication response error text:", errorText);
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      const { signature, expire, token } = data;

      return { signature, expire, token };
    } catch (error) {
      console.error("Authentication request failed:", error);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleViewButtonClick = () => {
    setIsAadharVisible(!isAadharVisible);
    setIsKisanCreditVisible(!isKisanCreditVisible);
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!decryptedUID) {
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
              name="jobtitle"
              value={job.jobtitle || ""}
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
              name="joblocation"
              value={job.joblocation || ""}
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
              name="jobdescription"
              value={job.jobdescription || ""}
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
              value={formatDate(job.startdate) || ""}
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
              value={formatDate(job.enddate) || ""}
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
              name="workinghours"
              value={job.workinghours || ""}
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
              name="wagesalary"
              value={job.wagesalary || ""}
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
              name="qualificationsskills"
              value={job.qualificationsskills || ""}
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
              value={formatDate(job.applicationdeadline) || ""}
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
                fileName={`${job.name}_aadharCardFront.jpg`}
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
                          alt={`${job.name} Aadhar Card Front`}
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
                fileName={`${job.name}_kisanCreditCard.jpg`}
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
                          alt={`${job.name} Kisan Credit Card`}
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
              value={job.name || ""}
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
              value={job.phone_number || ""}
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
              value={job.email || ""}
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

export default JobDetail;
