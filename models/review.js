const mongoose = require("mongoose");
const { Schema } = mongoose; 

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/room");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const reviewSchema = new Schema({
  comment: String,
  rating: Number,
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
