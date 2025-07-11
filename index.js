const express = require("express");
const app = express();

const port = 3000;
const mongoose = require("mongoose");
const List = require("./models/list.js");
const path = require("path");
const methodOverride = require('method-override');
 const engine = require('ejs-mate')
 const Review = require("./models/review.js")
 const session = require("express-session")
 const flash = require('connect-flash');
const passport=require('passport')
const passportLocal = require('passport-local')
const User = require('./models/auth.js');
const { url } = require("inspector");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/room");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname,'public')))





// app.get("/home", (req, res) => {
//   const kk = new List({
//     title: "sohnag",
//     description: "shreya ka ghr",
//     price: 544,
//     image: "",
//     location: "toria",
//   });kk.save().then(res=>{console.log(res)}).catch(err=>{console.log(err)})
// });
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {  expire: Date.now()*7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  }
}))
 app.use(flash())


app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.curuser = req.user
  next()
})
app.use(passport.initialize())
app.use(passport.session())


passport.use(new passportLocal(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", async (req, res) => {
  const listing = await List.find({});
  res.render("home.ejs", { listing });
});

app.get("/show/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await List.findById(id).populate("reviews");
    res.render("show.ejs", { listing });
  } catch (err) {
    console.log(err);
  }
});

// creat room
app.get('/addroom', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render('singup.ejs'); // assuming your view is named "signup.ejs"
  }
  res.render('addroom'); // assuming your view is named "addroom.ejs"
});
app.post('/croom', async(req,res)=>{
  let { title , description, img, price, location} = req.body;
  const hh = new List({
    title: title,
    description: description,
    img: img,
    price: price,
    location:location
  }) 
  await hh.save()
  req.flash("success","room is create")
 res.redirect('/')
})
//edit
app.get('/edit/:id', async(req,res)=>{
    if (!req.isAuthenticated()) {
    return res.render('singup.ejs'); // assuming your view is named "signup.ejs"
  }
  let {id} = req.params;
  const listings=  await List.findById(id)
  res.render("edit.ejs",{listings})
})
//update
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, img, price, location } = req.body;

  await List.findByIdAndUpdate(id, {
    title,
    description,
    img,
    price,
    location
  });

  res.redirect(`/show/${id}`);
});
//delete route
app.delete("/delete/:id", async(req,res)=>{
    if (!req.isAuthenticated()) {
    return res.render('singup.ejs'); // assuming your view is named "signup.ejs"
  }
  let {id} = req.params;
 await List.findByIdAndDelete(id);
 res.redirect('/')
})
// review 
app.post("/review/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
    return res.render('singup.ejs'); // assuming your view is named "signup.ejs"
  }
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const listing = await List.findById(id);
    if (!listing) return res.status(404).send("Listing not found");

    const rev = new Review({ comment, rating });
    await rev.save();

    listing.reviews.push(rev);
    await listing.save();

    res.redirect(`/show/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
// delet reviews
app.delete("/review/:id/rev/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/show/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting review");
  }
});
//singup 
app.get('/singup',(req,res)=>{
  res.render('singup.ejs')
})
//singp

app.post("/singupost", async (req,res,next)=>{
  let {email, username,password}= req.body;
   const tt =new User({email, username})
    const jj = await User.register(tt, password)
    req.logIn(jj,(err)=>{
      if(err){
 return next(err)
      }
       req.flash("success","login");
 res.redirect('/addroom')
    })
  
})

//login
app.get('/login',(req,res)=>{
res.render('login.ejs')
})
//loginpost
app.post('/loginpost',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function (req, res) {
    req.flash('success', 'Login successful now you can access everythings');
    res.redirect('/');
  }
);

  //logout
  app.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","logout");
      res.redirect('/')
    })
  })

  //search
  app.get('/search', async (req, res) => {
    const { location } = req.query;
    let results = [];

    if (location) {
        results = await List.find({ location: new RegExp(location, 'i') }); // Case-insensitive
    }

    res.render('search', { results, location });
});
app.listen(port, (req, res) => {
  console.log("server is working");
});
