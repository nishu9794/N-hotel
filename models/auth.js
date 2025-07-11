const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/room");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



const Userschema = new mongoose.Schema({
    email: String,
})
Userschema.plugin(passportLocalMongoose);
const User = mongoose.model("User", Userschema);
module.exports = User;