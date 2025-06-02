import Order from "../model/order.model.js";
import Book from "../model/book.model.js"; // To fetch book details if needed

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const {
            userId, // Optional: if the user is logged in
            customerDetails,
            addressDetails,
            paymentDetails, // Contains cardholderName, etc. (but not full card details for security)
            items, // Expecting an array like [{ bookId: "someId", quantity: 1 }]
        } = req.body;

        if (!customerDetails || !addressDetails || !items || items.length === 0) {
            return res.status(400).json({ message: "Missing required order information." });
        }

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const book = await Book.findById(item.bookId);
            if (!book) {
                return res.status(404).json({ message: `Book with ID ${item.bookId} not found.` });
            }
            // Use the current price from the database to prevent price manipulation from client-side
            const price = book.price;
            processedItems.push({
                bookId: item.bookId,
                quantity: item.quantity || 1,
                price: price,
            });
            totalAmount += price * (item.quantity || 1);
        }

        const newOrder = new Order({
            userId,
            customerDetails,
            addressDetails,
            paymentInfo: {
                // Example: Storing a mock transaction ID or status.
                // In a real app, this would come from your payment gateway integration.
                method: paymentDetails.method || "Card",
                status: "Pending", // Or "Completed" if payment is processed immediately
                // transactionId: "mock_transaction_12345" // Example
            },
            items: processedItems,
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: savedOrder });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error while creating order." });
    }
};

// Get all orders (potentially for admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "fullname email").populate("items.bookId", "name category");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get orders for a specific user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const orders = await Order.find({ userId }).populate("items.bookId", "name category image price");
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate("userId", "fullname email").populate("items.bookId");
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update order status (potentially for admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body; // e.g., "Processing", "Shipped", "Delivered"

        if (!status) {
            return res.status(400).json({ message: "Status is required for update." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};