const Address = require("../models/address");
const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.allAddress = async(req, res) => {
    const userId = req.user._id;
    let addresses = await Address.find({user: userId});
    req.session.returnUrl = req.originalUrl;
    res.status(200).json({addresses});
};

module.exports.renderSelectAddressForm = async (req, res) => {
  try {
    let { checkout } = req.query;
    let { id } = req.params;

    const userId = req.user._id;
    const addresses = await Address.find({ user: userId });
    if (addresses.length === 0) {
      let redirectTo = "/address/new";
      if (checkout) {
        redirectTo += `?checkout=${checkout}`;
      }
      if(checkout === "buyNow"){
        redirectTo = `/address/new/${id}?checkout=${checkout}`
      }
      return res.status(200).json({
        success: false,
        message: "No saved addresses. Redirect to add new.",
        redirectTo
      });
    }

    let product = null;
    if (checkout==="buyNow") {
      product = await Product.findById(id);
    }else if(checkout === "fromCart"){
       let cart = await Cart.findOne({ user: userId }).populate("items.item");
      req.session.returnUrl = req.originalUrl;

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({
          success: false,
          message: "Your cart is empty.",
          redirectTo: "/cart"
        });
      }
      product = cart.items;
    }
    req.session.returnUrl = req.originalUrl;
    res.status(200).json({
      success: true,
      message: "Fetched address selection data",
      addresses,
      checkout,
      product
    });

  } catch (error) {
    console.error("Error in renderSelectAddressForm:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.createAddress = async (req, res, next) => {
  try {
    const newAddress = new Address(req.body.address);
    newAddress.user = req.user._id;
    await newAddress.save();
    let redirectUrl = "/address";
    if (req.session.returnUrl) {
      redirectUrl = req.session.returnUrl;
      delete req.session.returnUrl;
    }

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: newAddress,
      redirectTo: redirectUrl
    });

  } catch (err) {
    console.error("Create Address Error:", err);
    next(err);
  }
};

module.exports.getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      address
    });

  } catch (error) {
    console.error("Error fetching address:", error);
    next()
  }
};

module.exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { ...req.body.address },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(401).json({
        success: false,
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
      redirectTo: "/address"
    });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message
    });
  }
};


// module.exports.deleteAddress = async(req, res) => {
//     let {id} = req.params;
//     let deletedAdd = await Address.findByIdAndDelete(id);
//     res.redirect("/address/all");
// };

module.exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    delete req.session.returnUrl;
    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      redirectTo: "/address/all"
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message
    });
  }
};
