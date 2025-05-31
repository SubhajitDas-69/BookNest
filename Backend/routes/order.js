const express = require("express");
const router = express.Router();
const { isLoggedin, isAdmin } = require("../middleware");
const orderController = require("../controllers/orders");


router.post("/checkout/buyNow/:id", isLoggedin, orderController.createOrderForOneItem);

// CREATE ORDER (from cart)
router.post("/create", isLoggedin, orderController.createOrderFromCart);

// CONFIRM ORDER
router.get("/confirm/:orderId", isLoggedin, orderController.confirmOrder);

//Order Summary
router.get("/summary/:orderId", isLoggedin, orderController.orderSummary);

// VIEW ALL ORDERS /orders
router.get("/", isLoggedin, orderController.getOrderHistory);

// Admin: view all customers order
router.get("/all", isAdmin, orderController.getAllOrders)

//Admin: Order Status update
router.put("/status/:id", isAdmin, orderController.updateOrderStatus);

//Admin: Order Delete

router.delete("/:orderId/items/:itemId", isAdmin, orderController.deleteOrder );

router.put("/:itemId/cancel", isLoggedin, orderController.cancelOrderItem);

router.get("/item/:itemId", isLoggedin, orderController.getOrderItem);

module.exports = router;
