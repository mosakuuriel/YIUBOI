const express = require("express");
const router = express.Router();

const { verifyAdmin } = require("../middleware/authMiddleware");

// ADMIN DASHBOARD TEST
router.get("/dashboard", verifyAdmin, (req, res) => {
    res.json({
        message: "Welcome to the YIUBOI Admin Dashboard!",
        admin: {
            name: req.admin.fullName,
            email: req.admin.email,
            role: req.admin.role
        }
    });
});

module.exports = router;