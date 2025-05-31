const Cart = require("../models/cart");
const Product = require("../models/product");
const ExpressError = require("../utils/ExpressError");

module.exports.showCart = async (req, res) =>{
    let userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.item");
    res.status(200).json({cart});
};

module.exports.addToCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(id);
    if (!product) {
      throw new ExpressError(404, "Product not found!");
    }

    let cart = await Cart.findOne({ user: userId }).populate("items.item");

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ item: id, quantity: 1 }]
      });
    } else {
      let existingItem = cart.items.find(i => i.item.equals(id));
      if (!existingItem) {
        cart.items.unshift({ item: id, quantity: 1 });
      } else {
        existingItem.quantity += 1;
      }
    }

    await cart.save();
    res.status(200).json({
        msg: "Added to cart",
        redirectTo: "/cart"
    });

  } catch (e) {
   next(e);
  }
};


module.exports.removeItemFromCartAndDeleteCart = async (req, res) =>{
    let { itemId } = req.params;
    let userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter(i => !i.item.equals(itemId));
    console.log(cart.items.length);

    if(cart.items.length < 1) {
        let deleteCart = await Cart.findOneAndDelete({user: userId}).populate("items.item");
        console.log(deleteCart);

        return  res.status(200).json({
            redirectTo: "/cart"
        });
    }
    await cart.save();

    res.status(200).json({
        msg: "Added to cart",
        redirectTo: "/cart"
    });
};

module.exports.updateCart = async(req, res, next) =>{
    try {
        const { itemId } = req.params;
        const { action } = req.body;
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.item");

        if (!cart){
            return res.redirect("/cart");
        } 
        const item = cart.items.find(i => i.item.equals(itemId));
        if (!item){
            return res.redirect("/cart");  
        } 
        if (action === "increase") {
            item.quantity += 1;
        } else if (action === "decrease") {
            item.quantity -= 1;
        }

        await cart.save();
        res.status(200).json({
            msg: "Item was updated!",
            redirectTo: "/cart"
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
}