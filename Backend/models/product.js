const mongoose = require("mongoose");
const Review = require("./reviews");

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [65, "Please enter a valid price"]
    },
    discount: {
        type: Number,
        default: 0
    },
    image: {
        url: String,
        filename: String
    },
    pdf: {
        url: String,
        filename: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["Books", "Notes"]
    }
});

productSchema.post("findOneAndDelete", async (item) => {
    if (item) {
        await Review.deleteMany({ _id: { $in: item.reviews } });
    }
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;