import repayStyles from './homepageStyles/homepage.module.css'
import api from "../utils/axiosConfig.js";
import toast from 'react-hot-toast'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Repay = () => {
   const [amount, setAmount] = useState('');
   const [error, setError] = useState('')
   const navigate = useNavigate();


  const handleSubmit = async(e)=>{
    e.preventDefault();

    if(amount === ''){
      return setError('Field cannot be empty')
    }
    else{
      setError('')
    }
    try{
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/v1/transaction/repay`, {amount}, {
     headers: {
      Authorization: `Bearer ${token}`
     }
      });

      toast.success('Repaid');
      navigate('/homepage');

    }
    catch(error){
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Error in making payment' );
    }
  }

  const handleChange = (e)=>{
    const value = e.target.value;
    setAmount(value)
  }

  return (
    <div className={repayStyles.repayContainer} onSubmit={handleSubmit}>
      {error ? <p style={{color:'red', position:'fixed', top:'100px', right:'50px'}} className={repayStyles.error}>{error}</p> : ''}
          <h1>Repay Loan</h1>
      <form className={repayStyles.repayform}>
        <div className={repayStyles.inputDiv}>
        <label>Enter amount</label>
        <input type='text' onChange={handleChange}/>
        </div>

        <div>
          <button type='submit'>Repay</button>
        </div>

      </form>
    </div>
  )
}

export default Repay
