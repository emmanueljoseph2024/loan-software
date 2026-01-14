import styles from './signuppageStyles/signup.module.css'
import signupImg from '../assets/signupimg.png'
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig.js";


const SignupPage = () => {
 const [email, setEmail] = useState('')
 const [name, setName] = useState('')
 const [password, setPassword] = useState('')
  const [error, setError] = useState("");

//validate email
  const validateInput= (value, inputname) => {

    if(inputname === 'password'){
      if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(value)) return "Password must contain at least one number";
  if (!/[!@#$%^&*]/.test(value)) return "Password must contain at least one special character";
  if (/\s/.test(value)) return "Password must not contain spaces";

  return "";
    }

    if(inputname === 'name'){
       if (!value) return "Name is required";

  //  block dangerous characters
  if (/[;"<>()[\]\\\/]/.test(value))
    return "Name contains invalid characters";

  //  block numbers
  if (/\d/.test(value))
    return "Name must not contain numbers";

  //  allow only letters, spaces, hyphen, apostrophe
  if (!/^[a-zA-Z\s'-]+$/.test(value))
    return "Name contains invalid characters";

  // prevent very short names
  if (value.trim().length < 2)
    return "Name is too short";

  return "";
    }

      if(inputname === 'email'){
              const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
  if (!value){ return "Email is required";
  }

    if (value.includes(" ")) 
      {return "Email must not contain spaces";}

    if (/[;'":<>()[\]\\]/.test(value)){
  return "Email contains invalid characters";}


    if (!value.includes("@")) {return "Email must contain @";}

    if (value.split("@").length !== 2){
      return "Email must contain only one @";}

    const [username, domain] = value.split("@");

    if (!username) {
      return "Email must have characters before @";
    }

    if (!allowedDomains.includes(domain)){
      return "Email must end with gmail.com, yahoo.com, or outlook.com";
    }

    return "";
  }
  
 // for other inputs, return no error
  return "";
    }

       //users object
  const users = {
    name: "",
    email: "",
    password: "",
  };
  
  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  const handleChange = (e) => {
   const {name, value } = e.target;
     setUser({ ...user, [name]: value });
    
   if(name === 'name'){
    setName(value);
   }

   if(name === 'email'){
    setEmail(value)
   }

   if(name === 'password'){
    setPassword(value)
   }
        // live validation
    setError(validateInput(value,name));
    
  };



 const checkEmptyBox = () => {
  if (email.trim().length === 0 || name.trim().length === 0 || password.trim().length === 0) {
    return "Input space cannot be empty";
  }
  return "";
};

const handleSubmit = async(e) => {
  e.preventDefault();

  //  check empty fields
  const emptyError = checkEmptyBox();
  if (emptyError) {
    setError(emptyError);
    return;
  }

  // validate email
  const emailError = validateInput(email, "email");
  if (emailError) {
    setError(emailError);
    return;
  }

  // validate name
  const nameError = validateInput(name, "name");
  if (nameError) {
    setError(nameError);
    return;
  }

    // validate password
  const passwordError = validateInput(password, "password");
  if (passwordError) {
    setError(passwordError);
    return;
  }
  setError("");

  await api
      .post(`${import.meta.env.VITE_API_URL}/api/v1/signup/signup`, user)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/login");
      })
      .catch((err) => {
          console.error("Error adding user:", err.response?.data || err.message);
      });
};

  //toggle button
  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = ()=>{
    setVisibility(!visibility);
  }

    const [displayBtn, setDisplayBtn] = useState(false)

  const handleDisplay = ()=>{
    setDisplayBtn(!displayBtn);
  }


  return (
    <div>
      <div className={styles.signupContainer}>
        {/* signup message */}
        <div className={styles.signupMessage}>
          <h1>Get Started with Ease</h1>
          <div className={styles.signupImg}>
        <img src={signupImg} alt='img'/>
          </div>
        </div>

        {/* form */}
        <div className={styles.signupForm}>
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            {/* inputbox name*/}
            <div className={styles.inputBox}>
            <label>Name:</label>
            <input type='text' name='name' placeholder='Enter your name' value={name}
        onChange={handleChange} />
            </div>
            
            {/* inputbox email*/}
            <div className={styles.inputBox}>
            <label>Email:</label>
            <input type='email' name='email' placeholder='eg.johndoe@gmail.com'  value={email}
        onChange={handleChange}/>
            </div>
             
             {/* inputbox password*/}
            <div className={styles.inputBox}>
            <label>Password:</label>
            <div  className={
                                styles.passwordContainer
                              }>
            <input type={visibility ? 'text' : 'password'} name='password' value={password}
        onChange={handleChange}/>
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
              <button onClick={()=>{
                handleSubmit()
              }} type='submit'>Sign up</button>
            </div>
          </form>
        </div>
      </div>
            {error && <p style={{ color: "red", position:'fixed', top:'50px', right:'50px',  boxShadow:'2px 2px 2px rgba(0, 0, 0, 0.2)', backgroundColor:'#ffffff', borderRadius:'10px', padding:'10px', textWrap:'wrap' }}>{error}</p>}

    </div>
  )
}

export default SignupPage
