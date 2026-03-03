import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactions.js';
import adminSetupRoutes from "./routes/adminSetupRoutes.js";
import accountRoutes from './routes/account.js';
import userRoutes from "./routes/userRoutes.js";
import authRoutes from './routes/auth.js';
import transferRoutes from "./routes/transferRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import tempAdminRoute from "./routes/tempAdminRoute.js";


dotenv.config();

const app = express();

const allowedOrigins = [
  "https://suissbank.com",
  "https://www.suissbank.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());
app.use("/api/transfers", transferRoutes);
app.use("/api/admin", adminSetupRoutes);
app.use("/api/users", userRoutes);
app.use("/support", supportRoutes);
app.use("/api/auth", authRoutes); // ✅ check this too
app.use('/api/accounts', accountRoutes);
app.use("/api", tempAdminRoute);
app.use("/api/transactions", transactionRoutes); // ✅ your error is here

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error(err));
