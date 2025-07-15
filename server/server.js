const express = require("express");
const cors = require("cors");
const sequelize = require("./config/connectionDB");
require("dotenv").config();

const LoginRouter = require("./route/user");
const path = require("path");
const sendEmail = require("./middleware/sendEmail");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (static folder)
app.use("/attachments", express.static(path.join(__dirname, "attachments")));

// Routes
app.get("/", (req, res) => {
  res.send(" Server is ON — Sequelize + MySQL Connected!");
});

app.use("/login", LoginRouter);
app.use("/sendEmail", sendEmail);

// Default port configuration
const PORT = process.env.PORT || 3000;

// Start server after MySQL (Sequelize) connection is successful
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Optional: Sync models
    await sequelize.sync({ alter: true });
    console.log("All models synced");

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server due to MySQL connection error:", error);
    process.exit(1);
  }
};

startServer();
