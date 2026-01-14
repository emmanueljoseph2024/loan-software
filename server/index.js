import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import DB connection and cloudinary
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.config.js";
import uploadRoutes from "./routes/upload.route.js";

// Routes
import signupRoute from "./routes/signupRoute.js";
import loginRoute from "./routes/loginRoute.js";
import kycRouter from "./routes/kycRoute.js";
import idnormRoutes from "./routes/idnorm.routes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import detailsRoute from "./routes/detailsRoute.js";
import adminRouter from "./routes/adminRoutes.js";

/* ------------------ CONFIG ------------------ */
dotenv.config();
const app = express();

/* ------------------ MIDDLEWARES ------------------ */
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ------------------ DATABASE ------------------ */
connectDB();

/* ------------------ API ROUTES ------------------ */
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.use("/api/v1/signup", signupRoute);
app.use("/api/v1/login", loginRoute);
app.use("/api/v1/kyc", kycRouter);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/idnorm", idnormRoutes);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/account", detailsRoute);
app.use("/api/v1/admin", adminRouter);

/* ------------------ CLOUDINARY TEST ------------------ */
app.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ message: "Cloudinary connected successfully", result });
  } catch (err) {
    res.status(500).json({
      message: "Cloudinary connection failed",
      error: err.message,
    });
  }
});

/* ------------------ FRONTEND SERVING (SAFE) ------------------ */
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../loan-app/dist");
app.use(express.static(frontendPath));

/* SPA fallback — DO NOT use "*" or "/*" */
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
