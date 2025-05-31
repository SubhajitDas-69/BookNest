require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const reviewRouter = require("./routes/review");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");
const addressRouter = require("./routes/address");
const cors = require('cors');

const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const port = 8080;

const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}

app.use(express.json());
app.use(cors({
    origin: "https://book-nest-sigma-blond.vercel.app",
    credentials: true
}));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true 
    }
};

app.set("trust proxy", 1);
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

app.use("/products", productRouter);
app.use("/products/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/payment", paymentRouter);
app.use("/address", addressRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
    let{StatusCode = 500, message = "Some error occured"} = err;
    res.status(StatusCode).json({message});
});

app.listen(port, () =>{
    console.log(`Server is listining on port ${port}`);
});