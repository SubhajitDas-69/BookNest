const Order = require("../models/order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

module.exports.createPaymentLink = async (req, res, next) => {
    try {
      let orderId = req.params.orderId;
      let order = await Order.findById(orderId);
      const paymentLink = await razorpay.paymentLink.create({
        amount: order.amount * 100,
        currency: "INR",
        customer: {
          name: order.shippingAddress.fullName,
          email: req.user.email,
          contact: order.shippingAddress.phone
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `https://book-nest-frontend-omega.vercel.app/orders/confirm/${orderId}`,
        callback_method: "get"
      });
     return res.status(200).json({ paymentLink: paymentLink.short_url });
  
    } catch (err) {
      next(err);
    }
  }

