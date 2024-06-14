import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const FarmersProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const decryptedUT = secureLocalStorage.getItem("user_type");
  const [updatedAddressData, setUpdatedAddressData] = useState({
    village: "",
    taluka: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [farmData, setFarmData] = useState({
    farm_name: "",
    farm_size: null,
    farm_type: "",
    crops_grown: "",
    irrigation_methods: "",
    storage_facilities: "",
    farming_methods: "",
    live_stocks: [{ type: "", count: 0 }],
    pesticides_used: [{ type: "", count: 0 }],
  });

  const [updatedFarmData, setUpdatedFarmData] = useState({
    farm_name: "",
    farm_size: null,
    farm_type: "",
    crops_grown: "",
    irrigation_methods: "",
    storage_facilities: "",
    farming_methods: "",
    live_stocks: {},
    pesticides_used: {},
  });

  useEffect(() => {
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

    const fetchFarmData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/farmers/fetchFarmersFarmData`,
          { decryptedUID }
        );
        setFarmData(res.data);
        setUpdatedFarmData(res.data); // Pre-fill the form with fetched data
      } catch (error) {
        console.error("Error fetching Farm Data:", error.message);
      }
    };

    fetchFarmData();
    fetchAddressData();
  }, [decryptedUID]);

  const handleAddressEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/farmers/updateFarmersAddress`,
        { updatedAddressData, decryptedUID }
      );
      if (res.status === 200) {
        alert("Address Updated Successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating address");
    }
  };

  const handleFarmDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/farmers/updateFarmersFarmDetails`,

        { updatedFarmData, decryptedUID }
      );
      if (res.status === 200) {
        alert("Farm Details Updated Successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddLivestock = () => {
    setUpdatedFarmData((prevState) => ({
      ...prevState,
      live_stocks: { ...prevState.live_stocks, "": 0 },
    }));
  };

  const handleRemoveLivestock = (key) => {
    setUpdatedFarmData((prevState) => {
      const live_stocks = { ...prevState.live_stocks };
      delete live_stocks[key];
      return { ...prevState, live_stocks };
    });
  };

  const handleLivestockChange = (key, value, isKeyChange) => {
    setUpdatedFarmData((prevState) => {
      const live_stocks = { ...prevState.live_stocks };
      if (isKeyChange) {
        const count = live_stocks[key];
        delete live_stocks[key];
        live_stocks[value] = count;
      } else {
        live_stocks[key] = value;
      }
      return { ...prevState, live_stocks };
    });
  };

  const handleAddPesticide = () => {
    setUpdatedFarmData((prevState) => ({
      ...prevState,
      pesticides_used: { ...prevState.pesticides_used, "": 0 },
    }));
  };

  const handleRemovePesticide = (key) => {
    setUpdatedFarmData((prevState) => {
      const pesticides_used = { ...prevState.pesticides_used };
      delete pesticides_used[key];
      return { ...prevState, pesticides_used };
    });
  };

  const handlePesticideChange = (key, value, isKeyChange) => {
    setUpdatedFarmData((prevState) => {
      const pesticides_used = { ...prevState.pesticides_used };

      if (isKeyChange) {
        const count = pesticides_used[key];
        delete pesticides_used[key];
        pesticides_used[value] = count;
      } else {
        pesticides_used[key] = value;
      }
      return { ...prevState, pesticides_used };
    });
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
    <>
      <Header pageName="Profile" />
      <div className="container-fluid">
        <div className="address-div mb-4 ">
          <h2 className="p-3 border  border-dark border-1 rounded-5 mb-4">
            Address
          </h2>
          <div className="container-fluid p-3 border  border-dark border-1 rounded-5">
            <form onSubmit={handleAddressEdit} className="row g-3 ">
              <div className="col-md-6">
                <label htmlFor="inputEmail4" className="form-label">
                  Village
                </label>
                <input
                  type="text"
                  name="village"
                  value={updatedAddressData.village || ""}
                  onChange={handleAddressChange}
                  className="form-control"
                  id="inputEmail4"
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
                  className="form-control"
                  id="inputPassword4"
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
                  className="form-control"
                  id="inputAddress"
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
                  onChange={handleAddressChange}
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
                  className="form-control"
                  id="inputZip"
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="farm-details-div mb-4">
          <h2 className="p-3 border  border-dark border-1 rounded-5 mb-4">
            Farm Details
          </h2>
          <div className="container-fluid p-3 border  border-dark border-1 rounded-5">
            <form onSubmit={handleFarmDetails}>
              <input type="hidden" name="uid" value={decryptedUID} />
              <input type="hidden" name="user_type" value={decryptedUT} />
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Farm Name</label>
                  <input
                    type="text"
                    name="farm_name"
                    value={updatedFarmData.farm_name}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        farm_name: e.target.value,
                      })
                    }
                    placeholder="Enter farm name"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Farm Size (acres)</label>
                  <input
                    type="number"
                    name="farm_size"
                    value={updatedFarmData.farm_size || ""}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        farm_size: e.target.value || "",
                      })
                    }
                    placeholder="Enter farm size"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Farm Type</label>
                  <input
                    type="text"
                    name="farm_type"
                    value={updatedFarmData.farm_type}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        farm_type: e.target.value,
                      })
                    }
                    placeholder="Enter farm type"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Crops Grown</label>
                  <input
                    type="text"
                    name="crops_grown"
                    value={updatedFarmData.crops_grown}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        crops_grown: e.target.value,
                      })
                    }
                    placeholder="List crops grown"
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Irrigation Methods</label>
                  <input
                    type="text"
                    name="irrigation_methods"
                    value={updatedFarmData.irrigation_methods}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        irrigation_methods: e.target.value,
                      })
                    }
                    placeholder="Describe irrigation methods"
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Storage Facilities</label>
                  <input
                    type="text"
                    name="storage_facilities"
                    value={updatedFarmData.storage_facilities}
                    onChange={(e) =>
                      setUpdatedFarmData({
                        ...updatedFarmData,
                        storage_facilities: e.target.value,
                      })
                    }
                    placeholder="Describe storage facilities"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Farming Methods</label>
                <input
                  type="text"
                  name="farming_methods"
                  value={updatedFarmData.farming_methods}
                  onChange={(e) =>
                    setUpdatedFarmData({
                      ...updatedFarmData,
                      farming_methods: e.target.value,
                    })
                  }
                  placeholder={farmData.farming_methods}
                  className="form-control"
                />
              </div>

              <div className="mb-4 mt-4">
                <h5>Livestock</h5>

                {updatedFarmData.live_stocks &&
                  Object.entries(updatedFarmData.live_stocks).map(
                    ([key, value], index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) =>
                            handleLivestockChange(key, e.target.value, true)
                          }
                          placeholder="Type of Livestock"
                          className="form-control"
                        />
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleLivestockChange(
                              key,
                              parseInt(e.target.value, 10),
                              false
                            )
                          }
                          placeholder="Count"
                          className="form-control"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLivestock(key)}
                          className="btn btn-danger btn-md"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                <button
                  type="button"
                  onClick={handleAddLivestock}
                  className="btn btn-primary"
                >
                  Add Livestock
                </button>
              </div>
              <div className="mb-4">
                <h5>Pesticides Used</h5>

                {updatedFarmData.pesticides_used &&
                  Object.entries(updatedFarmData.pesticides_used).map(
                    ([key, value], index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) =>
                            handlePesticideChange(key, e.target.value, true)
                          }
                          placeholder="Type of Pesticide"
                          className="form-control"
                        />
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handlePesticideChange(
                              key,
                              parseInt(e.target.value, 10),
                              false
                            )
                          }
                          placeholder="Count"
                          className="form-control"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePesticide(key)}
                          className="btn btn-danger btn-md"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                <button
                  type="button"
                  onClick={handleAddPesticide}
                  className="btn btn-primary"
                >
                  Add Pesticide
                </button>
              </div>

              <input
                type="submit"
                value="Edit Farm Details"
                className="form-control blue-buttons mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmersProfileContent;
