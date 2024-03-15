import React from "react";

const LandingCard2 = (props) => {
  return (
    <>
      <div className="card mb-3" style={{ maxWidth: 540 }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={props.img}
              className="img-fluid rounded-start"
              alt="..."
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{props.title}</h5>
              <p className="card-text">{props.para}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingCard2;
