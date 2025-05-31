const mongoose = require("mongoose");
const ProductData = require("./data");
const Book = require("../models/product");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/secondhand_store_db");
}
main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})

const initDB = async () =>{
    // await Book.deleteMany({});
    // BooksData.data = BooksData.data.map((obj) => ({...obj, owner: "67ec053458fa2dc9e56dd197"}));
    
    await Book.insertMany(ProductData.data);
    await Book.updateMany(
        { category: { $exists: false } },
        { $set: { category: "Notes" } }
      );
    console.log("Database was initialized")
}
initDB();