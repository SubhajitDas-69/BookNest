const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    fullName: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String,
  });
  
  module.exports = mongoose.model("Address", addressSchema);
  