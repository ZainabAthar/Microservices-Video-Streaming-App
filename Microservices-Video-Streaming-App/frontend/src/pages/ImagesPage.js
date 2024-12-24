import Images from "../components/Images/Images";
import MainNavigation from "../components/MainNavigation/MainNavigation";
import { useIsAuthenticated } from "react-auth-kit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ImagesPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated() ? (
        <>
          <MainNavigation />
          <Images />
        </>
      ) : ""}
    </>
  );
};

export default ImagesPage;
