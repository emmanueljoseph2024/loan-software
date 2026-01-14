import styles from './signuppageStyles/signup.module.css'
import signupImg from '../assets/signupimg.png'
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig.js";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [visibility, setVisibility] = useState(false);

  const validateInput = (value, inputname) => {
    if (inputname === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(value)) return "Password must contain uppercase letter";
      if (!/[a-z]/.test(value)) return "Password must contain lowercase letter";
      if (!/[0-9]/.test(value)) return "Password must contain a number";
      if (!/[!@#$%^&*]/.test(value)) return "Password must contain special character";
      if (/\s/.test(value)) return "Password must not contain spaces";
    }

    if (inputname === "name") {
      if (!value) return "Name is required";
      if (/\d/.test(value)) return "Name must not contain numbers";
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Invalid name format";
      if (value.trim().length < 2) return "Name is too short";
    }

    if (inputname === "email") {
      const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
      if (!value) return "Email is required";
      if (value.includes(" ")) return "Email must not contain spaces";
      if (!value.includes("@")) return "Email must contain @";

      const [_, domain] = value.split("@");
      if (!allowedDomains.includes(domain))
        return "Email must be gmail, yahoo, or outlook";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(validateInput(value, name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key].trim()) {
        setError("Input space cannot be empty");
        return;
      }

      const validationError = validateInput(formData[key], key);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError("");

    try {
      const res = await api.post("/api/v1/signup/signup", formData);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Signup failed. Try again."
      );
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupMessage}>
        <h1>Get Started with Ease</h1>
        <img src={signupImg} alt="signup" />
      </div>

      <div className={styles.signupForm}>
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className={styles.inputBox}>
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBox}>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {error && (
        <p style={{ color: "red", position: "fixed", top: 20, right: 20 }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SignupPage;
