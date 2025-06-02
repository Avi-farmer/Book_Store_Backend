import mongoose from "mongoose";
import User from "../model/user.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to make a user an admin by email
async function makeUserAdmin(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${user.fullname} (${user.email}) has been made an admin successfully`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address");
  console.log("Usage: node makeAdmin.js <email>");
  process.exit(1);
}

// Make the user an admin
makeUserAdmin(email);
