require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const app = express();


const authRoutes = require("./routes/authRoutes");


// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// connect Database
connectDB();

//Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/resume", resumeRoutes);

//Start Server
app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});