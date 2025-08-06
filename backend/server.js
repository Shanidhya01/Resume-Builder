require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes"); // Assuming you have a resumeRoutes file

const app = express();

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
app.use("/api/resume", resumeRoutes);


// serve upload folder
app.use(
  '/uploads', 
  express.static(path.join(__dirname, 'uploads'),{
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Adjust the origin as needed
    }
  })
);


//Start Server
app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});