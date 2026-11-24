const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderNumber: {
        type: String,
        unique: true,
        required: true
    },

    items: [
        {
            productId: {
                type: String
            },

            name: {
                type: String,
                required: true
            },

            image: {
                type: String,
                default: ""
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],

    delivery: {
        fullName: String,
        email: String,
        phone: String,
        state: String,
        address: String,
        landmark: String
    },

    subtotal: {
        type: Number,
        required: true
    },

    deliveryFee: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["card", "transfer"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },

    paymentReference: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);