import loginImg from '../assets/signupimg.png'
import styles from './loginpageStyles/loginpage.module.css'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [visibility, setVisibility] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await api.post("/api/v1/login/login", formData);

      toast.success(response.data.message);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);

      navigate("/kyc");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message || "Login failed. Try again."
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginMessage}>
        <h1>Welcome</h1>
        <img src={loginImg} alt="login" />
      </div>

      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className={styles.inputBox}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="eg.johndoe@gmail.com"
            />
          </div>

          <div className={styles.inputBox}>
            <label>Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={visibility ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {visibility ? (
                <FaEyeSlash
                  className={styles.icons}
                  onClick={() => setVisibility(false)}
                />
              ) : (
                <FaEye
                  className={styles.icons}
                  onClick={() => setVisibility(true)}
                />
              )}
            </div>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
