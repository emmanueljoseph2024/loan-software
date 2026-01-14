import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
    unique: true
  }
  ,
  name: String,
  email: String,

  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: {type: String, required:true},
  },
amount:{
  type: Number,
  default:100,
},
creditScore: {
      type: Number,
      default: 50, // start neutral
      min: 0,
      max: 100,
    },
    wallet: {
    balance: {
      type: Number,
      default: 0,
    },
  },

  loan: {
    currentAmount: {
      type: Number,
      default: 0,
    },
    maxEligibleAmount: {
      type: Number,
      default: 10, // starts at $10
    },
     principal: {type: Number, default:0},
  interest: Number,
  totalPayable: {type:Number, default:0},
  dueDate: Date,
    status: {
      type: String,
      enum: ["none", "active", "repaid", "defaulted"],
      default: "none",
    }
  },
    bankCode: String,

  paystackRecipientCode: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });

export default mongoose.model('user', userSchema);