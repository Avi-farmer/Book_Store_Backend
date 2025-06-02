import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    addressDetails: {
        address1: { type: String, required: true },
        address2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    paymentInfo: {
        method: { type: String, default: "Card" },
        transactionId: { type: String },
        status: { type: String, default: "Pending" },
    },
    items: [{ // Assuming an order can have multiple items (books)
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book", // Assuming you have a Book model
            required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }, // Price at the time of purchase
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Pending",
    }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;