import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactions.js';
import adminSetupRoutes from "./routes/adminSetupRoutes.js";
import accountRoutes from './routes/account.js';
import authRoutes from './routes/auth.js';
import transferRoutes from "./routes/transferRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transfers", transferRoutes);
app.use("/api/admin", adminSetupRoutes);
app.use("/api/auth", authRoutes); // ✅ check this too
app.use('/api/accounts', accountRoutes);
app.use("/api/transactions", transactionRoutes); // ✅ your error is here

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error(err));
