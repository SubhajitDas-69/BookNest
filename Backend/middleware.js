const Product = require("./models/product");
const Reviews = require("./models/reviews");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema, productsSchema } = require("./schema");
const passport = require("passport");

module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.status(401).json({
            msg: "You must be logged in first",
            redirectTo: "/login"
        })
    }  
    next();
};
module.exports.authenticateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password.",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      next();
    });
  })(req, res, next);
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.validateReview = (req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
module.exports.validateProducts = (req, res, next)=>{
    let {error}= productsSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewOwner = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Reviews.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id) && (req.user.role != "admin")) {
        return res.status(403).json({
            msg: "You dont't have permission!",
            redirectTo: `/products/${id}`
        })
    }
    next();
};

module.exports.isAdmin = async(req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === "admin") {
        return next();
    } else {
        return res.status(401).json({
            msg: "You are not authorized to access this page.",
            redirectTo: "/login"
        })
    }
}