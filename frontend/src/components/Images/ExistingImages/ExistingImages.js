import React, { useState, useEffect } from "react";
import styles from "./ExistingImages.module.css";
import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { useAuthUser } from "react-auth-kit";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setImagesData } from "../../../store/slices/UserSlice";

const ExistingImages = ({ images, onImageDeleted }) => {
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [showOptions, setShowOptions] = useState(null);

  const dispatch = useDispatch();
  const auth = useAuthUser();

  const ref = useRef(null);
  // const ref = React.createRef();

  const toggleOptions = (event, image) => {
    const rect = event.target.getBoundingClientRect();
    setOptionsPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });
    if (showOptions) {
      setShowOptions(null);
    } else {
      setShowOptions(image);
    }
  };
  const openFullScreen = (image) => {
    setShowOptions(null);
    setFullScreenImage(image);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  const handleView = (image) => {
    setShowOptions(null);
    openFullScreen(image);
  };

  const handleDownload = async (imageLink, imageName) => {
    setShowOptions(null);
    try {
      const response = await fetch(imageLink);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", imageName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success(`Downloaded: ${imageName}`);
    } catch (error) {
      console.error("Download failed:", error.message);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (image) => {
    setShowOptions(null);
    ref.current.continuousStart();
    try {
      const userId = auth().userId;
      const token = auth().token;
      const config = {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      console.log(`${image._id}`);
      console.log(`${userId}`);

      const response = await axios.delete(
        `${process.env.REACT_APP_GALLERY_BACKEND}/images/${userId}/${image._id}`,
        config
      );
      const data = response.data;
      console.log(data);
      dispatch(setImagesData({ data }));

      toast.success("Image deleted successfully!");
      ref.current.complete();
    } catch (error) {
      console.error("Error Deleting image:", error);
      ref.current.complete();
    }
  };

  return (
    <>
      <LoadingBar color="#FFB700" ref={ref} />

      <div className={styles.imageGrid}>
        {images.map((image, index) => (
          <div className={styles.imageCard} key={index}>
            <div className={styles.cardHeader}>
              <p className={styles.imageTitle}>{image.title}</p>
            </div>
            <div className={styles.cardBody}>
              
              <video
                src={image.imageLink}
                className={styles.fullScreenTrigger}
                controls
                onClick={() => openFullScreen(image)}
              />
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.imageSize}>{Math.ceil(image.size)} KB</p>
              <div
                className={styles.optionsButton}
                onClick={(event) => toggleOptions(event, image)}
              >
                ...
              </div>

              {showOptions && (
                <div
                  className={styles.options}
                  style={{
                    top: optionsPosition.top,
                    left: optionsPosition.left,
                  }}
                  key={`options_${index}`}
                >
                  <div
                    className={styles.option}
                    onClick={() => handleView(showOptions)}
                  >
                    View
                  </div>
                  <div
                    className={styles.option}
                    onClick={() =>
                      handleDownload(showOptions.imageLink, showOptions.title)
                    }
                  >
                    Download
                  </div>
                  <div
                    className={styles.option}
                    onClick={() => handleDelete(showOptions)}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {fullScreenImage && (
          <>
            <div className={styles.fullScreenOverlay} onClick={closeFullScreen}>
              <img
                src={fullScreenImage.imageLink}
                alt={fullScreenImage.title}
                className={styles.fullScreenImage}
                onClick={(e) => e.stopPropagation()}
              />
              <span className={styles.closeButton} onClick={closeFullScreen}>
                &#10005;
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ExistingImages;
