const Review = require("../models/reviews");
const Product = require("../models/product");

module.exports.createReview = async(req, res, next) => {
    try{
        let product = await Product.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        product.reviews.push(newReview);
        await newReview.save();
        await product.save();
    
        console.log("New review saved");

        await newReview.populate('author', 'username');
        res.status(200).json({
            msg: "New review created!",
            redirectTo: `/products/${product._id}`,
            review: newReview
        });
    }catch(e){
        console.log(e);
        next(e);
    }
};

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Product.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({
        msg: "Review deleted successfully!",
        redirectTo: `/products/${id}`
    });
};