import styles from "./homepageStyles/homepage.module.css";
import { useState, useEffect } from "react";
import api from "../utils/axiosConfig.js";
import { FaRegUser } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const HomePage = () => {
  const amountToBorrow = 1;
  const [status, setStatus] = useState({
    userStatus: null, eligibleAmount:null
  });
  const [verificationError, setVerificationError] = useState("");
  const [kyc, setKyc] = useState(null);
  const [list, setList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [shownav, setShowNav] = useState(false)

  const API_BASE = `/api/v1/kyc`;

  //fetchkyc details
  const fetchUserKYC = async () => {
    const token = localStorage.getItem("token"); // JWT token
    const res = await api.get(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  //handle verification
  const handleVerification = async () => {
    try {
      if (!kyc) {
        alert("KYC data not loaded yet");
        return;
      }

      const token = localStorage.getItem("token");
      const kycId = kyc._id; // get the KYC document ID from the state

      const res = await api.post(
        `/api/v1/idnorm/start`,
        { kycId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect user to IDNorm verification page
      window.location.href = res.data.redirectUrl;
    } catch (error) {
      console.error(error);
      alert("Failed to start verification");
    }
  };

  //transaction
  const transaction = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/api/v1/transaction/transfer`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Transacted successfully");

      getStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in getting loans");
      console.log(error);
    }
  };

  //get status
  const getStatus = async()=>{
    try{
     const token = localStorage.getItem('token');
     const response = await api.get(`/api/v1/transaction/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Status gotten');
        setStatus(response.data)
        console.log(response.data)
    }
    catch(error){
      console.log(error.response?.data?.message || 'Error getting user status');
      toast.error(error.response?.data?.message || 'Error getting user status');
    }
  }

  useEffect(()=>{
getStatus();
  },[])
 

  //show mobile navbar
  const shownavbar = ()=>{
    setVisible(!visible)
    setShowNav(!shownav);
  }
  return (
    <div>
      {/* header */}
      <header className={styles.homepageHeader}>
        <nav className={styles.desktopnav}>
          <ul>
            <li>
              <h1>
                Lend<span>Ease</span>
              </h1>
            </li>
            <li>
              <ul>
                <li>
                  <Link to='/history' className={styles.historyLink} >History</Link>
                </li>
                <li>
                  <Link to='/userdashboard' className={styles.dashboardLink}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/userform">
                    <MdAccountBalanceWallet className={styles.icon} />
                  </Link>
                </li>
                <li>
                  <Link to="/useraccount">
                    <FaRegUser className={styles.icon} />
                  </Link>
                </li>
                <li>
                  <button onClick={handleVerification}>Verify Identity</button>
                </li>
                <li><FaBars className={visible ? styles.view : styles.hide} onClick={shownavbar}/></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* mobilenav */}
        <nav className={shownav ? styles.showMobileNav : styles.hideMobileNav }>
          <ul>
               <li>
                  <FaTimes  className={styles.closeIcon} onClick={shownavbar}/>
                </li>
            <li>
              <ul>
                <li>
                  <Link to='/history' className={styles.historyLink} >History</Link>
                </li>
                <li>
                  <Link to='/userdashboard' className={styles.dashboardLink}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/userform">
                    <MdAccountBalanceWallet className={styles.icon} />
                  </Link>
                </li>
                <li>
                  <Link to="/useraccount">
                    <FaRegUser className={styles.icon} />
                  </Link>
                </li>
                <li>
                  <button onClick={handleVerification}>Verify Identity</button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      {/* main */}
      <main>
        {/* verification error */}
        {verificationError && (
          <p className={styles.verificationError}>{verificationError}</p>
        )}
        {kyc ? (
          <p className={styles.welcome}>Welcome, {kyc.fullName}</p>
        ) : (
          <p className={styles.welcome}>Welcome user</p>
        )}
        <p className={styles.notice}>
          Note: if your identity is not verified you cannot borrow loans
        </p>
        <div></div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            {status?.userStatus === 0 ? <h2 style={{color:'#35cca7'}}>Available amount</h2> : <h2 style={{color:'rgb(213, 42, 42)'}}>Insufficient fund</h2> }
            <h1>{status?.userStatus === 0 ? `$${status?.eligibleAmount}` : <span style={{color:'red', fontSize:'3rem'}}>-${status?.userStatus}</span>}</h1>
            {status?.userStatus === 0 ? (
              <button className={styles.borrowBtn} onClick={transaction}>
                Borrow
              </button>
            ) : (
              <button className={styles.repayBtn}><Link to='/repay' className={styles.repayLink}>Repay</Link></button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default HomePage;
