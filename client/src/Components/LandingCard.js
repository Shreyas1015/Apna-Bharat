import React from "react";

const LandingCard = (props) => {
  return (
    <>
      <div className="card rounded-3 my-3" style={{ height: "92%" }}>
        <img
          style={{ height: "100%" }}
          className="object-fit-cover img-fluid rounded-3"
          src={props.img}
          alt=""
        />
      </div>
    </>
  );
};

export default LandingCard;
