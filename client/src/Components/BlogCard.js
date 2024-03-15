import React from "react";

const BlogCard = (props) => {
  return (
    <>
      <div className="card mx-auto my-3 rounded-4 " style={{ height: "50%" }}>
        <img
          src={props.img}
          className="img-fluid object-fit-cover rounded-4"
          alt=""
          style={{ height: "100%" }}
        />
        <div className="card-body">
          <p className="card-text text-secondary">{props.dateOfPublish}</p>
          <h4 className="card-title">{props.title}</h4>
          <p className="card-text text-secondary">{props.desc}</p>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
