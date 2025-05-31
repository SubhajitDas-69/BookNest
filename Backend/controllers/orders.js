const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const Product = require("../models/product");

module.exports.createOrderForOneItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selectedAddressId = req.body.selectedAddress;
    const userId = req.user._id;

    const product = await Product.findById(id);
    const address = await Address.findById(selectedAddressId);

    if (!product || !address) {
      return res.status(404).json({
        success: false,
        message: "Product or Address not found"
      });
    }

    const orderItem = {
      item: {
        title: product.title,
        author: product.author,
        description: product.description,
        price: product.price,
        discount: product.discount,
        category: product.category,
        image: {
          url: product.image.url,
          filename: product.image.filename
        }
      },
      quantity: 1,
    };

    if (product.category === "Notes" && product.pdf) {
      orderItem.item.pdf = {
        url: product.pdf.url,
        filename: product.pdf.filename
      };
    }

    const totalAmount = product.price;

    const newOrder = new Order({
      user: userId,
      items: [orderItem],
      amount: totalAmount,
      shippingAddress: {
        fullName: address.fullName,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        phone: address.phone
      }
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      redirectTo: `/payment/${newOrder._id}/create-payment-link`
    });
  } catch (error) {
    console.log("Buy Now Error:", error);
    next(error);
  }
};

module.exports.createOrderFromCart = async (req, res, next) => {
  try {
    const selectedAddressId = req.body.selectedAddress;
    const userId = req.user._id;

    const address = await Address.findById(selectedAddressId);
    const cart = await Cart.findOne({ user: userId }).populate("items.item");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const orderItems = cart.items.map(cartItem => {
      const product = cartItem.item;
      const orderItem = {
        item: {
          title: product.title,
          author: product.author,
          description: product.description,
          price: product.price,
          discount: product.discount,
          category: product.category,
          image: {
            url: product.image.url,
            filename: product.image.filename
          }
        },
        quantity: cartItem.quantity,
      };
       if (product.category === "Notes" && product.pdf) {
        orderItem.item.pdf = {
          url: product.pdf.url,
          filename: product.pdf.filename
        };
      }

      return orderItem;
    });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      amount: totalAmount,
      shippingAddress: {
        fullName: address.fullName,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        phone: address.phone,
      }
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      success: true,
      message: "Order created from cart",
      redirectTo: `/payment/${newOrder._id}/create-payment-link`
    });

  } catch (err) {
    console.error("Create Order From Cart Error:", err);
    next(err);
  }
};

module.exports.confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    order.items.forEach(item => {
      item.status = "Order Placed";
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      updatedOrder: order
    });

  } catch (err) {
    console.error("Order Confirmation Error:", err);
    next(err);
  }
};
module.exports.orderSummary = async(req, res, next) =>{
  try{
    const order = await Order.findById(req.params.orderId);

    res.status(200).json({
      success: true,
      message: "Redirected to Order summary",
      order
    });

  }catch(err){
    next(err);
  }
}

module.exports.getOrderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      orders
    });

  } catch (err) {
    console.error("Order History Error:", err);
    next(err);
  }
};

module.exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders
    });
    console.log(orders);
    

  } catch (err) {
    next(err);
  }
};

module.exports.updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, itemId } = req.body;

  try {
    const updatedOrder = await Order.updateOne(
      { _id: id, "items._id": itemId },
      { $set: { "items.$.status": status } }
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      redirectTo: "/orders/all"
    });

  } catch (err) {
    next(err);
  }
};

module.exports.deleteOrder = async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const filteredItems = order.items.filter(item => item._id.toString() !== itemId);

    if (filteredItems.length === order.items.length) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    order.items = filteredItems;

    if (filteredItems.length === 0) {
      await Order.deleteOne({ _id: orderId });
      return res.status(200).json({ message: 'Item deleted and order removed (no items left)' });
    }

    try {
      await order.save();
      res.status(200).json({ message: 'Item removed from order', updatedOrder: order });
    } catch (saveErr) {
      res.status(500).json({ message: 'Save failed', error: saveErr.message });
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports.getOrderItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const order = await Order.findOne({ 'items._id': itemId });

    if (!order) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    const orderItem = order.items.find(item => item._id.toString() === itemId);

    res.json({
      orderId: order._id,
      shippingAddress: order.shippingAddress,
      status: orderItem.status,
      orderItem,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.cancelOrderItem= async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const order = await Order.findOne({
      user: userId,
      "items._id": itemId,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }
    const item = order.items.find(i => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    if (item.status === "Shipped" || item.status === "Delivered" || item.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel item. Status is already '${item.status}'.`,
      });
    }
    if (item.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Item is already cancelled.",
      });
    }
    item.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order item cancelled successfully.",
      order,
    });
  } catch (e) {
    next(e);
  }
};

