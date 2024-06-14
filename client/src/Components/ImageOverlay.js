import React, { useState } from "react";
import { IkImage } from "imagekitio-react";

const ImageOverlay = ({ imageUrl }) => {
  const [showImage, setShowImage] = useState(false);

  const toggleImage = () => {
    setShowImage(!showImage);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={toggleImage}>View Image</button>
      {showImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(5px)",
          }}
        >
          <IkImage
            path={imageUrl}
            transformation={[{ height: 300, width: 400 }]}
          />
        </div>
      )}
    </div>
  );
};

export default ImageOverlay;
