const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.allProducts = async (req, res) =>{
    let {category} = req.query;
    if(category){
        let allProduct = await Product.find({category});
        req.session.returnTo = req.originalUrl;
        return res.status(200).json({allProduct});
    }
    let allProduct = await Product.find();
    req.session.returnTo = req.originalUrl;
    return res.status(200).json({allProduct});
};


module.exports.createProduct = async (req, res, next) => {
  try {
    const files = req.files || {};
    const imageFiles = files["product[image]"];
    const pdfFiles = files["product[pdf]"];

    const newProduct = new Product(req.body.product);

    if (imageFiles && imageFiles.length > 0) {
      newProduct.image = {
        url: imageFiles[0].path,
        filename: imageFiles[0].filename
      };
    }

    if (
      newProduct.category === "Notes" &&
      pdfFiles &&
      pdfFiles.length > 0
    ) {
      newProduct.pdf = {
        url: pdfFiles[0].path,
        filename: pdfFiles[0].filename
      };
    }

    await newProduct.save();

    res.status(200).json({
      msg: "New item added",
      redirectTo: "/products"
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};



module.exports.showProduct = async (req, res, next)=>{
    try{
        let {id} = req.params;
        let product = await Product.findById(id).populate(
            {
                path: "reviews", 
                populate: {
                    path:"author"
                }
            });
        if(!product){
            next(new ExpressError(404, "Item not Found or Deleted"));
        }else{
            res.status(200).json({product});
        }
    }catch(e){
        next(e);
    }
};


module.exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || {};
    const imageFiles = files["product[image]"];
    const pdfFiles = files["product[pdf]"];

    const updatedData = req.body.product;
    const updatedProduct = await Product.findByIdAndUpdate(id, { ...updatedData }, { new: true });

    if (imageFiles && imageFiles.length > 0) {
      updatedProduct.image = {
        url: imageFiles[0].path,
        filename: imageFiles[0].filename
      };
    }
    if (
      updatedProduct.category === "Notes" &&
      pdfFiles &&
      pdfFiles.length > 0
    ) {
      updatedProduct.pdf = {
        url: pdfFiles[0].path,
        filename: pdfFiles[0].filename
      };
    }

    await updatedProduct.save();

    console.log(updatedProduct);
    res.status(200).json({
      msg: "Item successfully updated!",
      redirectTo: `/products/${id}`
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};


module.exports.deleteProduct = async (req, res)=>{
    let {id} = req.params;
    let deletedProduct = await Product.findByIdAndDelete(id);
    const carts = await Cart.find({ "items.item": id });
        for (const cart of carts) {
            cart.items = cart.items.filter(cartItem => cartItem.item.toString() !== id);
            if (cart.items.length === 0) {
                await Cart.findByIdAndDelete(cart._id);
              } else {
                await cart.save();
              }
        }
    console.log(deletedProduct);
    const redirectUrl = req.session.returnTo || "/products";
    res.status(200).json({
        msg: "Item deleted successfully",
        redirectTo: redirectUrl
    })
};
