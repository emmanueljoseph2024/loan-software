import { useState, useEffect }  from 'react'
import toast from 'react-hot-toast'
import styles from './homepageStyles/homepage.module.css'
import api from "../utils/axiosConfig.js";

const Transaction = () => {
const [transaction, setTransaction] = useState(null);
const [loading, setLoading] = useState(true);


const getTransaction = async()=>{
    try{
        const token = localStorage.getItem('token');
const response = await api.get(`/api/v1/transaction/history`,{
    headers: {
        Authorization: `Bearer ${token}`,
    },
})

toast.success('Transaction gotten successfully');
setTransaction(response.data);
console.log(response.data);

    }
    catch(error){
        console.log(error.response?.data?.message || 'Error getting user transactions');
        toast.error(error.response?.data?.message || 'Error getting transactions')
    }
    finally{
        setLoading(false)
    }
}

useEffect(()=>{
  getTransaction();
},[]);

  return (
    <div className={styles.transactions}>
        <h1>Transactions</h1>
    {
        loading ? (<p>Loading...</p>) : transaction ? (
            transaction.map((item, index)=>(
                <div key={index} className={styles.transaction}> 
                    <p><span>AMOUNT :</span>${item.amount}</p>
                    <p><span>REFERENCE :</span>{item.reference}</p>
                    <p><span>STATUS :</span>{item.status}</p>
                    <p><span>TYPE :</span>{item.type}</p>
                    <p><span>DIRECTION :</span>{item.direction}</p>
                    <p><span>DATE :</span>{item.createdAt}</p>
                </div>
            ))
        ) : (
            <p>There is no transaction record</p>
        )
    }
    </div>
  )
}

export default Transaction
