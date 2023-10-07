const connectDB = require("./data/connectdb");

var express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  cors = require("cors"),
  dotnev = require("dotenv"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campgrounds = require("./models/campgrounds"),
  User = require("./models/user"),
  flash = require("connect-flash");
(seedDB = require("./seeds")), (Comment = require("./models/comment"));

dotnev.config();

// seedDB();
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp_v6");
connectDBctDB();

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // u dont have to write .ejs everywhere with file name
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.get("/", function (req, res) {
  // server 1

  res.render("landing");
});

// use async await with try catch
app.get("/campgrounds", async (req, res) => {
  //INDEX route
  try {
    let allCampgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", {
      campgrounds: allCampgrounds,
      currentUser: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/campgrounds/new", isLoggedIn, function (req, res) {
  //NEW route
  res.render("campgrounds/new");
});

// use async await with try catch
app.post("/campgrounds", isLoggedIn, async (req, res) => {
  //CREATE route
  try {
    let { name, image, description } = req.body;
    let author = {
      id: req.user._id,
      username: req.user.username,
    };
    let newcampground = {
      name,
      image,
      description,
      author: author,
    };
    await Campgrounds.create(newcampground);
    res.redirect("/campgrounds");
  } catch (err) {
    console.log(err);
  }
});

// use async await with try catch
app.get("/campgrounds/:id", async (req, res) => {
  //SHOW route
  try {
    let foundCampgrounds = await Campgrounds.findById(req.params.id)
      .populate("comments")
      .exec();
    res.render("campgrounds/show", { campgrounds: foundCampgrounds });
  } catch (err) {
    console.log(err);
  }
});

function isLoggedIn(req, res, next) {
  //midelwire
  if (req.isAuthenticated()) {
    //flash
    return next();
  }
  req.flash("error", "You need to be logged-in first!");
  res.redirect("/login");
}

// comments server
app.get("/campgrounds/:id/comments/new", isLoggedIn, async (req, res) => {
  //comments new
  try {
    let foundCampgrounds = await Campgrounds.findById(req.params.id);
    res.render("comments/new", { campground: foundCampgrounds });
  } catch (err) {
    console.log(err);
  }
});

// use async await with try catch
app.post("/campgrounds/:id/comments", isLoggedIn, async (req, res) => {
  //create comments
  try {
    let foundCampgrounds = await Campgrounds.findById(req.params.id);
    let comment = await Comment.create(req.body.comment);
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    await comment.save();
    foundCampgrounds.comments.push(comment);
    foundCampgrounds.save();
    req.flash("success", "Successfully added a new comment!");
    res.redirect("/campgrounds/" + foundCampgrounds._id);
  } catch (err) {
    console.log(err);
  }
});

app.get("/campgrounds/:comment_id/edit", function (req, res) {
  //comments edit
  res.send("jerfwn");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
  //register
  try {
    let newUser = new User({ username: req.body.username });
    await User.register(newUser, req.body.password);
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome " + user.username);
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.render("register");
  }
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", async (req, res) => {
  //logout
  try {
    await req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
  } catch (err) {
    console.log(err);
  }
});


//edit
app.get("/campgrounds/:id/edit", check, function (req, res) {
  //check
  Campgrounds.findById(req.params.id).then(function (foundCampgrounds) {
    res.render("campgrounds/edit", { campground: foundCampgrounds });
  });
});
//is user logged in

//update
// use async await with try catch
app.put("/campgrounds/:id", check, async (req, res) => {
  //check
  try {
    let foundCampgrounds = await Campgrounds.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    if (foundCampgrounds) {
      req.flash("success", "Campground updated!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  } catch (err) {
    console.log(err);
  }
});


//destroy
app.delete("/campgrounds/:id", check, async (req, res) => {
  //check
  try {
    let foundCampgrounds = await Campgrounds.findByIdAndRemove(req.params.id);
    if (foundCampgrounds) {
      req.flash("success", "Campground deleted!");
      res.redirect("/campgrounds");
    }
  } catch (err) {
    console.log(err);
  }
});

//    function isLoggedIn(req,res,next){

//      if(req.isAuthenticated()){
//           return next();
//      }
//      req.flash("error"," you need to be logged-in first!");
//      res.redirect("/login");
//}

// use async await with try catch
async function check(req, res, next) {
  //check
  try {
    if (req.isAuthenticated()) {
      let foundCampgrounds = await Campgrounds.findById(req.params.id);
      if (foundCampgrounds.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash("error", "Permission denied !!");
        res.redirect("back");
      }
    } else {
      req.flash("error", "You need to be logged-in first!");
      res.redirect("back");
    }
  } catch (err) {
    console.log(err);
  }
}

const port = process.env.PORT || 900;

app.listen(port, function () {
  console.log("Server Has Started!");
});
