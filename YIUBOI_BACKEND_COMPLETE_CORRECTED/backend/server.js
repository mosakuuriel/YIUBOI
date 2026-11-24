// =====================================
// YIUBOI BACKEND SERVER
// =====================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// ROUTES
// =====================================
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/order");

app.get("/", (req, res) => {
    res.json({ message: "Welcome to YIUBOI Backend!", status: "running" });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);

// Unknown API routes return JSON (not Express HTML), preventing JSON parse confusion.
app.use("/api", (req, res) => {
    res.status(404).json({
        message: `API route not found: ${req.method} ${req.originalUrl}`
    });
});

// Unknown non-API routes also return a clear JSON response.
app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler.
app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error);
    if (res.headersSent) return next(error);
    res.status(error.status || 500).json({
        message: error.message || "An unexpected server error occurred."
    });
});

// =====================================
// START AFTER DATABASE CONNECTION
// =====================================
const PORT = process.env.PORT || 5000;

async function startServer() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing from backend/.env");
        process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from backend/.env");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("YIUBOI Database Connected Successfully!");
        app.listen(PORT, () => {
            console.log(`YIUBOI Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        process.exit(1);
    }
}

startServer();
