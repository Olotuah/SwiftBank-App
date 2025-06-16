// scripts/seedAccounts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';
import User from '../models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const seedAccountsForAllUsers = async () => {
  const users = await User.find();

  const accountTypes = ["Main Account", "Savings", "Dollar Wallet"];

  for (const user of users) {
    for (const type of accountTypes) {
      const exists = await Account.findOne({ user: user._id, name: type });
      if (!exists) {
        await Account.create({
          user: user._id,
          name: type,
          balance: 10000, // Default starting balance
        });
        console.log(`✅ Created ${type} for ${user.email}`);
      }
    }
  }

  console.log("✅ All accounts seeded.");
  process.exit();
};

seedAccountsForAllUsers().catch(console.error);
