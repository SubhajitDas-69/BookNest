
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      item: {
        title: String,
        author: String,
        description: String,
        price: Number,
        discount: Number,
        category: String,
        image: {
          url: String,
          filename: String
        },
        pdf: {
          url: String,
          filename: String
        }
      },
      quantity:{
        type: Number,
        default: 1
      },
      status: {
        type: String,
        enum: ["Order Confirmed","Order Placed", "Out of Delivery", "Delivered", "Cancelled", "Pending"],
        default: "Pending"
      },
    }
  ],
  amount: {
    type: Number,
    required: true
  },
  
  shippingAddress: 
    {
      fullName: String,
      street: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      phone: String,
    },
},{ timestamps: true });
module.exports = mongoose.model("Order", orderSchema);