import { useState } from "react";
import styles from "./kycStyles/kyc.module.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig.js";

const KYCForm = () => {

  const user = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    user:user,
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    idType: "",
    idNumber: "",
    idPhoto: "",
    selfie: "",
    email: "",
    phone: "",
    address: "",
    proofOfAddress: "",
    employmentStatus: "",
    monthlyIncome: "",
    employer: "",
    jobTitle: "",
    sourceOfFunds: "",
    consentCreditCheck: false,
    agreeTerms: false
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle regular inputs and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: Boolean(checked) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file uploads
  const handleFileUpload = async (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const fileData = new FormData();
    fileData.append("file", files[0]);
    fileData.append("fieldName", name);

    try {
      const res = await api.post("/api/v1/upload", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({ ...formData, [name]: res.data.url }); // Store string URL
      toast.success(`${name} uploaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload ${name}`);
    }
  };

  // Validate inputs
  const validateInput = () => {
    let errorMsg = "";

    if (!formData.fullName.trim()) return errorMsg += "Full Name is required.\n";
    if (!formData.dob) return errorMsg += "Date of Birth is required.\n";
    if (!formData.gender) return errorMsg += "Gender is required.\n";
    if (!formData.nationality.trim()) return errorMsg += "Nationality is required.\n";
    if (!formData.idType) return errorMsg += "ID Type is required.\n";
    if (!formData.idNumber.trim()) return errorMsg += "ID Number is required.\n";
    if (!formData.idPhoto) return errorMsg += "ID Photo is required.\n";
    if (!formData.selfie) return errorMsg += "Selfie with ID is required.\n";
    if (!formData.email.trim()) return errorMsg += "Email is required.\n";
    if (!formData.phone.trim()) return errorMsg += "Phone number is required.\n";
    if (!formData.address.trim()) return errorMsg += "Address is required.\n";
    if (!formData.proofOfAddress) return errorMsg += "Proof of Address is required.\n";
    if (!formData.employmentStatus) return errorMsg += "Employment status is required.\n";
    if (!formData.monthlyIncome.trim()) return errorMsg += "Monthly income is required.\n";
    if (!formData.employer.trim()) return errorMsg += "Employer name is required.\n";
    if (!formData.jobTitle.trim()) return errorMsg += "Job title is required.\n";
    if (!formData.sourceOfFunds.trim()) return errorMsg += "Source of funds is required.\n";
    if (!formData.consentCreditCheck) return errorMsg += "You must consent to credit check.\n";
    if (!formData.agreeTerms) return errorMsg += "You must agree to terms & privacy policy.\n";

    return errorMsg;
  };

  // Submit KYC
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateInput();

    if (errorMsg) return setError(errorMsg);
    setError("");

    try {
      const res = await api.post(`/api/v1/kyc/create`, formData);
      toast.success(res.data.message);
      navigate("/userform");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error submitting KYC");
    }
  };

//stop
  return (
    <form className={styles.kycForm} onSubmit={handleSubmit}>
      <h1 className={styles.alreadyFilled}>Already filled this? Navigate to the <Link to='/userform' className={styles.homepageLink}>Userform</Link></h1>
      <h2 className={styles.formHeader}>KYC Verification</h2>

      {/* Display top error messages */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Personal Information */}
      <div className={styles.section}>
        <h3>Personal Information</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
        />
      </div>

      {/* Identification */}
      <div className={styles.section}>
        <h3>Identification Documents</h3>
        <select name="idType" value={formData.idType} onChange={handleChange}>
          <option value="">Select ID Type</option>
          <option value="passport">Passport</option>
          <option value="nationalID">National ID</option>
          <option value="driverLicense">Driver's License</option>
        </select>

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
        />

        <label>
          Upload ID Photo:
          <input type="file" name="idPhoto" onChange={handleChange} />
        </label>

        <label>
          Upload Selfie with ID:
          <input type="file" name="selfie" onChange={handleChange} />
        </label>
      </div>

      {/* Contact Information */}
      <div className={styles.section}>
        <h3>Contact Information</h3>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Residential Address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>
          Upload Proof of Address:
          <input type="file" name="proofOfAddress" onChange={handleChange} />
        </label>
      </div>

      {/* Financial Information */}
      <div className={styles.section}>
        <h3>Financial Information</h3>
        <select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
        >
          <option value="">Employment Status</option>
          <option value="employed">Employed</option>
          <option value="selfEmployed">Self-Employed</option>
          <option value="student">Student</option>
          <option value="unemployed">Unemployed</option>
        </select>

        <input
          type="text"
          name="monthlyIncome"
          placeholder="Monthly Income"
          value={formData.monthlyIncome}
          onChange={handleChange}
        />

        <input
          type="text"
          name="employer"
          placeholder="Employer / Company Name"
          value={formData.employer}
          onChange={handleChange}
        />
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title / Occupation"
          value={formData.jobTitle}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sourceOfFunds"
          placeholder="Source of Funds (optional)"
          value={formData.sourceOfFunds}
          onChange={handleChange}
        />
      </div>

      {/* Agreements */}
      <div className={styles.section}>
        <label>
          <input
            type="checkbox"
            name="consentCreditCheck"
            checked={formData.consentCreditCheck}
            onChange={handleChange}
          />
          I consent to credit check and background verification
        </label>

        <label>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
        </label>
        <p>I agree to the <Link to='terms' className={styles.link}>Terms & Conditions</Link> and <Link to='privacypolicy' className={styles.link}>Privacy Policy</Link></p>
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit KYC
      </button>
    </form>
  );
};

export default KYCForm;
