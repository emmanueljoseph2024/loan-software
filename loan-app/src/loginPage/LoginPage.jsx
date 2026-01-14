import loginImg from '../assets/signupimg.png'
import styles from './loginpageStyles/loginpage.module.css'
import { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  //users object
  const users = {
    email: "",
    password: "",
  };

   //setter function for user
  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  //toggle button
  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = ()=>{
    setVisibility(!visibility);
  }

  const [displayBtn, setDisplayBtn] = useState(false)

  const handleDisplay = ()=>{
    setDisplayBtn(!displayBtn);
  }

   //input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  };
   //form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api
      .post(`${import.meta.env.VITE_API_URL}/api/v1/login/login`, user)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/kyc");
        // Save token & user ID after successful login
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);

      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        toast.error(errorMessage, { position: "top-right" });
        console.error("Error logging in:", err);
        console.log("Server error:", err.response.data);
      });
  };
  return ( 
    <div>
       <div className={styles.loginContainer} >
              {/* login message */}
              <div className={styles.loginMessage}>
                <h1>Welcome</h1>
                <div className={styles.loginImg}>
              <img src={loginImg} alt='img'/>
                </div>
              </div>
      
              {/* form */}
              <div className={styles.loginForm}>
                <form onSubmit={handleSubmit}>
                  <h2>Login</h2>
      
                  {/* inputbox- Email */}
                  <div className={styles.inputBox}>
                  <label>Email:</label>
                  <input type='email' placeholder='eg.johndoe@gmail.com' onChange={handleChange}   value={user.email} name='email' />
                  </div>
                   
                   {/* inputbox - Password*/}
                  <div className={styles.inputBox}>
                  <label>Password:</label>
                  <div className={
                    styles.passwordContainer
                  }>
      <input type={visibility ? 'text' : 'password'} onChange={handleChange}   name='password'
  value={user.password} />
      {
displayBtn ? <FaEye 
                 
                 onClick={() => {
  handleDisplay();
  toggleVisibility(); 
}}  className={styles.icons}
/> : <FaEyeSlash 
onClick={() => {
  handleDisplay();
  toggleVisibility();
}} className={styles.icons}
/>
      }
                  </div>
                  </div>
                  
                  <div className={styles.inputBox}>
                    <button type='submit'>Login</button>
                  </div>
                </form>
              </div>
            </div>
    </div>
  )
}

export default LoginPage
