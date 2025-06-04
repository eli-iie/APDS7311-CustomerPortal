const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI; // Assign the URI to a variable for clarity

  if (!mongoUri) {
    console.error("Mongo URI is not defined in .env");
    process.exit(1); // Exit the process if URI is not found
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
