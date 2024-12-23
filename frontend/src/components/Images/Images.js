import NewImage from "./NewImage/NewImage";
import { useState,useEffect } from "react";
import ExistingImages from "./ExistingImages/ExistingImages";
import ImagesHero from "./ImageHero/ImagesHero";
import Footer from "../Footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux/es/exports";

const Images = () => {
  const [images, setImages] = useState([]);
  const user = useSelector((state) => state.users.userData);
  useEffect(() => {
    if(user.gallery.images[0]){
      setImages(user.gallery.images)
    }
    console.log(user)
  }, [user]);

  return (
    <>
      <NewImage/>
      <ExistingImages images={images} />
      <Footer/>

    </>
  );
};

export default Images;
