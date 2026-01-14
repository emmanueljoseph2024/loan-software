import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import { mockTransfer } from "../services/paystackMock.js";
import Wallet from  '../models/walletModel.js';
import Signup from "../models/signupModel.js";

/* ================================
   GET LOAN (DISBURSE LOAN)
================================ */
export const getLoan = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const person = await Signup.findById(authUserId);
    if (!person) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Auth user id:", authUserId);
console.log("Type:", typeof authUserId);


    const user = await User.findOne({user:authUserId});

    if(!user){
      return res.status(404).json({message: 'User profile not found'});
    }
    console.log(user.name);

    /*  Eligibility checks */
    if (user.creditScore < 40) {
      return res.status(403).json({
        message: "Credit score too low for loan",
      });
    }

    if (user.loan?.status === "active") {
      return res.status(400).json({
        message: "You already have an active loan",
      });
    }

    /* Loan configuration */
    const loanAmount = user.loan.maxEligibleAmount; // demo
    const interestRate = 0.1; // 10%
    const interest = loanAmount * interestRate;
    const totalPayable = loanAmount + interest;

    if (loanAmount > user.loan.maxEligibleAmount) {
      return res.status(400).json({
        message: "Loan amount exceeds eligibility",
      });
    }

    /*  Simulated Paystack transfer */
    const transfer = await mockTransfer(loanAmount);

    /* Save transaction */
    await Transaction.create({
      userId: user._id,
      amount: loanAmount,
      reference: transfer.reference,
      status: "success",
      type: "loan_disbursement",
      direction: "credit",
    });

    /* Update loan info */
    user.loan = {
      status: "active",
      principal: loanAmount,
      interest,
      totalPayable,
      amountPaid: 0,
      startDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    };

    /*  Credit wallet */
    user.wallet.balance += loanAmount;

    await user.save();

    return res.status(200).json({
      message: "Loan disbursed successfully (SIMULATED)",
      loan: user.loan,
      reference: transfer.reference,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Loan disbursement failed" });
  }
};



const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY; // store in .env

export const listBanks = async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
      params: {
        country: 'nigeria',
        type: 'nuban',
        currency: 'NGN'
      }
    });
    // response.data.data contains the list of banks
    return res.json({ banks: response.data.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch banks' });
  }
};



export const getTransaction = async(req,res)=>{
  try{
const userId = req.user.id;

const user = await Signup.findById(userId);
if(!user){
  return res.status(404).json({message: 'User not found'});
}

const recipient  = await User.findOne({user:userId});

if(!recipient){
  return res.status(404).json({message:'Recipient not found'});
}

const recipientTransactions = await Transaction.find({userId: recipient._id}).sort({ createdAt: -1 });

if(!recipientTransactions){
  return res.status(404).json({message: 'User has no transactions yet'});
}

return res.status(200).json(recipientTransactions);


  }
  catch(error){
    console.log(error);
    return res.status(500).json({errorMessage: error.message});
  }
}


export const getLoanStatus = async(req,res)=>{
try{
const userId = req.user.id;
const user = await Signup.findById(userId);
if(!user){
  return res.status(404).json({message: 'User not found'})
}

const recipient = await User.findOne({user:userId});
if(!recipient){
  return res.status(404).json({message:'Add your details in the user section'})
}

const recipientStatus = recipient.loan.totalPayable;
const recipientEligibility = recipient.loan.maxEligibleAmount;
return res.status(200).json({userStatus: recipientStatus, eligibleAmount: recipientEligibility});
}
catch(error){
  console.log(error)
  return res.status(500).json({errorMessage: error.message});
}
}