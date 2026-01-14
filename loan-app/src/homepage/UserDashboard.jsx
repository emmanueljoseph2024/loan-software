import { useState, useEffect } from "react";
import styles from "./homepageStyles/homepage.module.css";
import api from "../utils/axiosConfig.js";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // optional loading state

  const getUserDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/api/v1/transaction/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Only show success toast if response is OK
      toast.success("User details fetched successfully!");

      // Set the returned data
      setData(response.data);
    } catch (error) {
      console.error(
        "Error fetching user dashboard:",
        error.response?.data?.message || error.message
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDashboard();
  }, []);

  return (
    <div>
      <h1 className={styles.userdashboardHeader}>Dashboard</h1>
      <div className={styles.walletBalance}>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <>
            <h2>Wallet Balance</h2>
            <h1>${data.walletBalance}</h1>

            {data.loan ? (
              <>
                <h2>Loan Info</h2>
                <p>Status: {data.loan.status}</p>
                <p>Principal: {data.loan.principal}</p>
                <p>Interest: {data.loan.interest}</p>
                <p>Total Payable: {data.loan.totalPayable}</p>
              </>
            ) : (
              <p>No active loan</p>
            )}
          </>
        ) : (
          <p>User data not available</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
