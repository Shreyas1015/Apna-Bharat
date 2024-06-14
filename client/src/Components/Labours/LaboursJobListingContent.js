import React, { useEffect, useState } from "react";
import Header from "../Header";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import { IKContext, IKImage } from "imagekitio-react";
import toast from "react-hot-toast";

const LaboursJobListingContent = () => {
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [jobs, setJobs] = useState([]);
  const [visibleImage, setVisibleImage] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});
  const [jobTracker, setJobTracker] = useState([]);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    const getAllFarmersJobApplications = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/labours/getAllJobs`,
          { decryptedUID }
        );
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchJobApplicationTracker = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/labours/fetchJobApplicationTracker`,
          { decryptedUID }
        );
        const appliedJobsData = res.data.reduce((acc, curr) => {
          acc[curr.jid] = true;
          return acc;
        }, {});
        setAppliedJobs(appliedJobsData);
        setJobTracker(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const checkEligibility = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/labours/checkEligibility`,
          { decryptedUID }
        );
        if (res.data.message === 1) {
          console.log("Eligible");
          setIsEligible(true);
        } else if (res.data.message === 0) {
          console.log(" Not Eligible");
          setIsEligible(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error Checking eligibility");
      }
    };
    getAllFarmersJobApplications();
    fetchJobApplicationTracker();
    checkEligibility();
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

  const toggleImageVisibility = (jobId, imageType) => {
    const key = `${jobId}-${imageType}`;
    setVisibleImage((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleApply = async (jobId) => {
    if (!isEligible) {
      toast.error(
        "You are not eligible to apply for this job. Please Fill In Your Details In Labourers Profile Section"
      );
      return;
    }
    if (appliedJobs[jobId]) {
      alert("You have already applied for this job.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/labours/applyForJob`,
        { jobId, decryptedUID }
      );
      if (response.status === 200) {
        setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
        alert("Applied successfully!");
      } else {
        alert("Failed to apply!");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Error applying for job.");
    }
  };

  const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  return (
    <div>
      <Header pageName="Job Listing" />
      <div className="container-fluid">
        <div className="row">
          {jobs.map((job, index) => (
            <div key={index} className="col-lg-12 my-4">
              <div className="card rounded-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{job.jobtitle}</h5>
                  <p className="text-muted">
                    <small>
                      Posted on:
                      {new Date(job.posteddate).toLocaleDateString()}
                    </small>
                  </p>

                  <hr />
                  <p className="card-text">{job.jobdescription}</p>
                  <p>
                    <strong>Application Deadline:</strong>{" "}
                    {new Date(job.applicationdeadline).toLocaleDateString()}
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Location:</strong> {job.joblocation}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(job.startdate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(job.enddate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Wage/Salary:</strong> {job.wagesalary}
                      </p>
                      <p>
                        <strong>Working Hours:</strong> {job.workinghours}{" "}
                        hours/day
                      </p>
                      <p>
                        <strong>Qualifications/Skills:</strong>{" "}
                        {job.qualificationsskills}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <button
                        onClick={() => toggleImageVisibility(job.jid, "aadhar")}
                        className="btn btn-outline-primary mt-2"
                      >
                        View Aadhar Card
                      </button>
                      {visibleImage[`${job.jid}-aadhar`] && (
                        <IKContext
                          publicKey={publicKey}
                          urlEndpoint={urlEndpoint}
                          authenticator={authenticator}
                        >
                          <div
                            className="image-preview-backdrop"
                            onClick={() =>
                              toggleImageVisibility(job.jid, "aadhar")
                            }
                          >
                            <div className="image-preview">
                              <IKImage
                                src={job.aadharcard}
                                alt="Aadhar Card"
                                transformation={[
                                  { height: 300, width: 300, quality: 90 },
                                ]}
                              />
                            </div>
                          </div>
                        </IKContext>
                      )}
                    </div>
                    <div className="col-md-6">
                      <IKContext
                        publicKey={publicKey}
                        urlEndpoint={urlEndpoint}
                        authenticator={authenticator}
                      >
                        <button
                          onClick={() =>
                            toggleImageVisibility(job.jid, "kisan")
                          }
                          className="view-button btn btn-outline-primary"
                          type="button"
                        >
                          View Kisan Credit Card
                        </button>
                        {visibleImage[`${job.jid}-kisan`] && (
                          <div
                            className="image-preview-backdrop"
                            onClick={() =>
                              toggleImageVisibility(job.jid, "kisan")
                            }
                          >
                            <div className="image-preview">
                              <IKImage
                                src={job.kissancard}
                                alt="Kisan Credit Card"
                                transformation={[
                                  { height: 300, width: 300, quality: 90 },
                                ]}
                              />
                            </div>
                          </div>
                        )}
                      </IKContext>
                    </div>
                  </div>
                  <hr />
                  <button
                    className="btn btn-success"
                    onClick={() => handleApply(job.jid)}
                    disabled={appliedJobs[job.jid]}
                  >
                    {appliedJobs[job.jid] ? "Already Applied" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaboursJobListingContent;
