import {useState, useEffect } from 'react'
import styles from './homepageStyles/homepage.module.css'
import api from "../utils/axiosConfig.js";
import toast from 'react-hot-toast';

const UserAccount = () => {
       const [kyc, setKyc] = useState(null)
       const [accountDetails, setAccountDetails] = useState(null)

    const API_BASE = `/api/v1/kyc`;


    const fetchUserKYC = async () => {
  const token = localStorage.getItem("token"); // JWT token
  const res = await api.get(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.data; // returns the user KYC object
};

useEffect(() => {
    const getKYC = async () => {
      const userKYC = await fetchUserKYC();
      setKyc(userKYC);
    };
    getKYC();
  }, []);


  //get user account details
  const fetchAccountDetails = async()=>{
   try{
        const token = localStorage.getItem("token"); // JWT token
       const response = await api.get(`/api/v1/account/accountdetails`, {
    headers: {
      Authorization: `Bearer ${token}`
    }} );

    console.log("API RESPONSE:", response.data);
    return response.data;
   }
   catch(error){
      toast.error('Error fetching account details' || error.response?.data?.message);
      console.log(error);
   }
  }

  useEffect(()=>{
  const getAccountDetails = async()=>{
  const details = await fetchAccountDetails();
  if(details){
  setAccountDetails(details[0]);
  }

  }
  getAccountDetails();
  },[])

  return (
    <div>
      <div>
        <h1 className={styles.accountHeader}>Your account</h1>
       {kyc ? (
        <div className={styles.userDetails}>
          <div className={styles.details}>  
             <strong>Name:</strong>
             <p>{kyc.fullName}</p>
          </div>

             <div className={styles.details}>  
             <strong>DOB:</strong>
             <p>{kyc.dob}</p>
          </div>

             <div className={styles.details}>  
             <strong>Gender:</strong>
             <p>{kyc.gender}</p>
          </div>

            <div className={styles.details}>  
             <strong>Nationality:</strong>
             <p>{kyc.nationality}</p>
          </div>

             <div className={styles.details}>  
             <strong>ID Type:</strong>
             <p>{kyc.idType}</p>
          </div>

             <div className={styles.details}>  
             <strong>ID Number:</strong>
             <p>{kyc.idNumber}</p>
          </div>

             <div className={styles.details}>  
             <strong>Email:</strong>
             <p>{kyc.email}</p>
          </div>

             <div className={styles.details}>  
             <strong>Phone:</strong>
             <p>{kyc.phone}</p>
          </div>

             <div className={styles.details}>  
             <strong>Address:</strong>
             <p>{kyc.address}</p>
          </div>

             <div className={styles.details}>  
             <strong>Employment Status:</strong>
             <p>{kyc.employmentStatus}</p>
          </div>

             <div className={styles.details}>  
             <strong>Employer:</strong>
             <p>{kyc.employer}</p>
          </div>

             <div className={styles.details}>  
             <strong>Monthly Income:</strong>
             <p>{kyc.monthlyIncome}</p>
          </div>
        
           <div className={styles.details}>  
             <strong>Job Title:</strong>
             <p>{kyc.jobTitle}</p>
          </div>

             <div className={styles.details}>  
             <strong>Source Of Funds:</strong>
             <p>{kyc.sourceOfFunds}</p>
          </div>

          <div className={styles.details}>  
             <strong>Verification Status:</strong>
             <p>{kyc.verificationStatus}</p>
          </div>
        </div>
       ) :(<p className={styles.notifyUser}>Loading details...</p>)} 

       <div className={styles.lineBreak}></div>

       <h1 className={styles.accountHeader}>Account details</h1>
       {
         accountDetails ? 
         (<div className={styles.userDetails}>
                <div className={styles.details}>  
             <strong>Bank Name</strong>
             <p>{accountDetails?.bankDetails?.bankName}</p>
          </div>

           <div className={styles.details}>  
             <strong>Account Name</strong>
             <p>{accountDetails?.bankDetails?.accountName}</p>
          </div>
         
         <div className={styles.details}>  
             <strong>Account Number</strong>
             <p>{accountDetails?.bankDetails?.accountNumber}</p>
          </div>

         </div>) : (<p style={{textAlign:'center', margin:'10px'}}>No details </p>)
       }
      </div>


    </div>
  )
}

export default UserAccount
