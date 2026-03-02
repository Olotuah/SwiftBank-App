// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    admin: { type: Boolean, default: false },

    accountNumber: { type: String, unique: true },
    accountType: { type: String, default: "Main Account" },
    balance: { type: Number, default: 0 },

    // ✅ NEW: Transfer PIN (hashed)
    transferPinHash: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.matchTransferPin = async function (enteredPin) {
  if (!this.transferPinHash) return false;
  return await bcrypt.compare(String(enteredPin), this.transferPinHash);
};

export default mongoose.model("User", UserSchema);
