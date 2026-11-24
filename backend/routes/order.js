const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Order = require("../models/order");
const User = require("../models/user");
const { verifyAdmin } = require("../middleware/authMiddleware");

// =====================================
// CUSTOMER AUTHENTICATION
// =====================================
const verifyCustomer = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.startsWith("Bearer ")
            ? authorization.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({ message: "Please log in to continue." });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not configured." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "customer") {
            return res.status(403).json({ message: "Customer account required." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired login session." });
    }
};

// =====================================
// CREATE ORDER (SAVED AS PENDING/UNPAID)
// =====================================
router.post("/", verifyCustomer, async (req, res) => {
    try {
        const { items, delivery, paymentMethod } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }
        if (!delivery || !paymentMethod) {
            return res.status(400).json({ message: "Delivery details and payment method are required." });
        }
        if (!["card", "transfer"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method." });
        }

        const cleanItems = items.map((item) => ({
            productId: String(item.productId || ""),
            name: String(item.name || "").trim(),
            image: String(item.image || ""),
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));

        for (const item of cleanItems) {
            if (!item.name || !Number.isFinite(item.price) || item.price < 0 ||
                !Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({ message: "One or more cart items are invalid." });
            }
        }

        const cleanDelivery = {
            fullName: String(delivery.fullName || "").trim(),
            email: String(delivery.email || "").trim(),
            phone: String(delivery.phone || "").trim(),
            state: String(delivery.state || "").trim(),
            address: String(delivery.address || "").trim(),
            landmark: String(delivery.landmark || "").trim()
        };

        if (!cleanDelivery.fullName || !cleanDelivery.phone || !cleanDelivery.address) {
            return res.status(400).json({ message: "Please provide your name, phone number and delivery address." });
        }

        const subtotal = cleanItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = 0;
        const total = subtotal + deliveryFee;

        const order = await Order.create({
            user: req.user._id,
            orderNumber: `YIU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            items: cleanItems,
            delivery: cleanDelivery,
            subtotal,
            deliveryFee,
            total,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending"
        });

        return res.status(201).json({ message: "Order created successfully.", order });
    } catch (error) {
        console.error("ORDER CREATION ERROR:", error);
        return res.status(500).json({ message: "Unable to create your order." });
    }
});

// =====================================
// CUSTOMER ORDER RECORDS
// =====================================
router.get("/my-orders", verifyCustomer, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.json({ message: "Your order records.", orders });
    } catch (error) {
        console.error("CUSTOMER ORDERS ERROR:", error);
        return res.status(500).json({ message: "Unable to retrieve your orders." });
    }
});

// =====================================
// ADMIN VIEW ALL ORDERS
// =====================================
router.get("/admin/all", verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "fullName email phone")
            .sort({ createdAt: -1 });
        return res.json({ message: "All orders retrieved successfully.", orders });
    } catch (error) {
        console.error("ADMIN ORDERS ERROR:", error);
        return res.status(500).json({ message: "Unable to retrieve orders." });
    }
});

// =====================================
// ADMIN MARK ORDER AS PAID
// PATCH /api/order/admin/:orderId/payment
// =====================================
router.patch("/admin/:orderId/payment", verifyAdmin, async (req, res) => {
    try {
        const { paymentStatus, paymentReference } = req.body;
        if (paymentStatus !== "paid" && paymentStatus !== "pending") {
            return res.status(400).json({ message: "Payment status must be 'paid' or 'pending'." });
        }

        const update = { paymentStatus };
        if (paymentReference !== undefined) {
            update.paymentReference = String(paymentReference).trim();
        }

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { $set: update },
            { new: true, runValidators: true }
        ).populate("user", "fullName email phone");

        if (!order) return res.status(404).json({ message: "Order not found." });
        return res.json({ message: `Order payment status updated to ${paymentStatus}.`, order });
    } catch (error) {
        console.error("PAYMENT STATUS UPDATE ERROR:", error);
        if (error.name === "CastError") return res.status(400).json({ message: "Invalid order ID." });
        return res.status(500).json({ message: "Unable to update payment status." });
    }
});

module.exports = router;
