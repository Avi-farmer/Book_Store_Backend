import express from "express";
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
} from "../controller/order.controller.js";
// import { protect, admin } from "../middleware/authMiddleware.js"; // Optional: for authentication/authorization

const router = express.Router();

// POST /api/orders - Create a new order
router.post("/", createOrder); // Anyone can create an order for now

// GET /api/orders - Get all orders (Admin only - if auth middleware is used)
// router.get("/", protect, admin, getAllOrders);
router.get("/", getAllOrders); // For now, accessible to all for testing

// GET /api/orders/myorders/:userId - Get logged in user's orders
// router.get("/myorders/:userId", protect, getUserOrders);
router.get("/myorders/:userId", getUserOrders); // For now, accessible via userId param

// GET /api/orders/:orderId - Get single order by ID
// router.get("/:orderId", protect, getOrderById);
router.get("/:orderId", getOrderById); // For now, accessible to all

// PUT /api/orders/:orderId/status - Update order status (Admin only - if auth middleware is used)
// router.put("/:orderId/status", protect, admin, updateOrderStatus);
router.put("/:orderId/status", updateOrderStatus); // For now, accessible to all

export default router;