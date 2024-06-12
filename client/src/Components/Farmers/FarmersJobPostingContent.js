import React, { useEffect, useState } from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import { IKContext, IKImage } from "imagekitio-react";

const FarmersJobPostingContent = () => {
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [jobs, setJobs] = useState([]);
  const [visibleImage, setVisibleImage] = useState({});

  useEffect(() => {
    const getAllFarmersJobApplications = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/getAllJobs`,
          { decryptedUID }
        );
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllFarmersJobApplications();
  }, [decryptedUID]);

  const deleteJob = async (jobId) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.REACT_APP_BASE_URL}/farmers/deleteJob`,
        {
          data: { decryptedUID, jobId },
        }
      );

      setJobs((prevJobs) => prevJobs.filter((job) => job.jid !== jobId));
      if (res.status === 200) {
        alert("Job deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

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

  const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  return (
    <div>
      <Header pageName="Job Posting" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 text-center">
            <Link to={`/farmers/job-form?uid=${uid}`}>
              <button className="btn btn-outline-dark btn-lg form-control">
                Job Form
              </button>
            </Link>
          </div>

          <div className="col-lg-3 text-center">
            <Link to={`/farmers/applied-applications?uid=${uid}`}>
              <button className="btn btn-outline-dark btn-lg form-control">
                Applied Application
              </button>
            </Link>
          </div>

          <div className="col-lg-3 text-center">
            <Link to={`/farmers/labourer-management?uid=${uid}`}>
              <button className="btn btn-outline-dark btn-lg form-control">
                Labourer Management
              </button>
            </Link>
          </div>

          <div className="col-lg-3 text-center">
            <Link to={`/farmers/payment-management?uid=${uid}`}>
              <button className="btn btn-outline-dark btn-lg form-control">
                Payment Management
              </button>
            </Link>
          </div>
        </div>
        <h3 className="p-4 mt-5 border border-dark rounded-5">
          Your Job Applications
        </h3>
        <div className="container-fluid">
          <div className="row">
            {jobs.map((job, index) => (
              <div key={index} className="col-lg-12 my-4">
                <div className="card rounded-4 shadow-sm">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <h5 className="card-title text-primary">
                          {job.jobtitle}
                        </h5>
                        <p className="text-muted">
                          <small>
                            Posted on:
                            {new Date(job.posteddate).toLocaleDateString()}
                          </small>
                        </p>
                      </div>
                      <div className="col-lg-6 text-end">
                        <button
                          className="btn border border-danger rounded-4 p-3  mx-5"
                          onClick={() => deleteJob(job.jid)}
                        >
                          <i
                            className="fa-solid fa-trash fa-xl"
                            style={{ color: "#df2a2a" }}
                          />
                        </button>
                      </div>
                    </div>

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
                          onClick={() =>
                            toggleImageVisibility(job.jid, "aadhar")
                          }
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

                    <Link
                      to={`/farmers/edit-job-form?uid=${uid}&edit=${job.jid}`}
                    >
                      <button className="btn btn-outline-primary my-3">
                        Edit Job
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmersJobPostingContent;
