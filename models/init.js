
const  mongoose = require("mongoose")
const  data = require("./data.js")
const List = require("./list.js")
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/room");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const init = async()=>{
 await List.deleteMany({})
 const j =await List.insertMany(data.dt)

}
init();