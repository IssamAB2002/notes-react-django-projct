import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  useEffect(() => {
    auth();
  }, []);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  // refresh access token handle
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post("api/token/refresh/", {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
        navigate("/");
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };
  // authorization handle function
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    } else {
      const decodedToken = jwtDecode(token);
      const tokenExpiration = decodedToken.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration < now) {
        refreshToken();
      } else {
        setIsAuthorized(true);
        navigate("/");
      }
    }
  };
  if (isAuthorized === null) {
    return <div>Loading ...</div>;
  } else {
    return isAuthorized ? children : <Navigate to={"/login"} />;
  }
}
export default ProtectedRoute;