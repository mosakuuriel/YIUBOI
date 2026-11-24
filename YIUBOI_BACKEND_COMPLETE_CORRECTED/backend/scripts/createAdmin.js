const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/user");

async function createAdmin() {
    try {
        if (!process.env.MONGO_URI || !process.env.ADMIN_EMAIL ||
            !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME ||
            !process.env.ADMIN_PHONE) {
            throw new Error("MONGO_URI and all ADMIN_* values must be set in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to YIUBOI Database");

        const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("An account with this email already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        const admin = await User.create({
            fullName: process.env.ADMIN_NAME.trim(),
            email,
            phone: process.env.ADMIN_PHONE.trim(),
            password: hashedPassword,
            role: "admin"
        });

        console.log("YIUBOI Admin Created Successfully!");
        console.log("Admin Email:", admin.email);
    } catch (error) {
        console.error("Admin Creation Error:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    }
}

createAdmin();
