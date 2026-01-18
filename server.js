import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

console.log("🔥 server.js file loaded");

dotenv.config();

console.log("🔥 env loaded");


connectDB();

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
