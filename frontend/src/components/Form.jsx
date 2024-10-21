import { useNavigate } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/Form.css";
function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const name = method == "login" ? "Login" : "Register";
  const navigate = useNavigate();
  const handleSubmitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await api.post(route, { 
        username, password });
        if (method === "login") {
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
          navigate("/");
        } else {
          navigate("/login");
        }
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmitForm} className="form-container">
      <h1>{name}</h1>
      <input
        type="text"
        id="username"
        className="form-input"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        className="form-input"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
