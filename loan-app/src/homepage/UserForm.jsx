import { useState, useEffect} from 'react'
import styles from './homepageStyles/homepage.module.css'
import api from "../utils/axiosConfig.js";
import toast from "react-hot-toast";

const UserForm = () => {
      const bankDetails = {
        name:'',
        email: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
      }

      const [accountDetails, setAccountDetails] = useState(bankDetails);
      const [error, setError] = useState('')
     
      const postBankDetails = async(e)=>{
        try{
          e.preventDefault();
            const token = localStorage.getItem("token"); // JWT token
        const response = await api.post(`/api/v1/account/accountdetails`, accountDetails, {
    headers: {
      Authorization: `Bearer ${token}`
    }});
        toast.success('Posted successfully');
        
        }
        catch(error){
           toast.error(error.response?.data?.message || 'Error sending details');
           console.log(error)
        } 
      }


      const handleChange = (e)=>{
       const {name, value} = e.target;
       setAccountDetails({...accountDetails, [name]:value})
      console.log(e.target.value)
   
      }


  return (
    <div>
      <div className={styles.bankDetailsContainer}>
        {error ? <p className={styles.error}>{error}</p> : ''}
        <h1>Bank Details</h1>
        <form className={styles.userForm} onSubmit={postBankDetails}>

                      {/* inputbox */}
   <div className={styles.inputBox}>
    <label>Name</label>
    <input type='text' placeholder='Enter your name' onChange={handleChange} name='name'/>
   </div>

               {/* inputbox */}
   <div className={styles.inputBox}>
    <label>Email</label>
    <input type='text' placeholder='Enter your email' onChange={handleChange} name='email' />
   </div>


          {/* inputbox */}
   <div className={styles.inputBox}>
    <label>BankName</label>
    <input type='text' placeholder='Enter your Bank name' name='bankName' onChange={handleChange} />
   </div>

            {/* inputbox */}
   <div className={styles.inputBox}>
    <label>Account Name</label>
    <input type='text' placeholder='Enter your account name' name='accountName' onChange={handleChange} />
   </div>

            {/* inputbox */}
   <div className={styles.inputBox}>
    <label>Account Number</label>
    <input type='text' placeholder='Enter your account number'  name='accountNumber' onChange={handleChange} />
   </div>


            {/* inputbox */}
   <div className={styles.inputBox}>
  <button type='submit'>Submit</button>
   </div>

   
        </form>
        </div>
    </div>
  )
}

export default UserForm
