const jwt = require("jsonwebtoken");
const User = require("../models/user");

// VERIFY ADMIN
const verifyAdmin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.startsWith("Bearer ")
            ? authorization.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({ message: "Access denied. Please log in." });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not configured." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await User.findById(decoded.id);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        req.admin = admin;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = { verifyAdmin };
