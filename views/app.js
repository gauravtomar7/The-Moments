var express        =require("express"),
     app           =express(),
     bodyparser    =require("body-parser"),
     mongoose      =require("mongoose"),
     passport      =require("passport"),
     LocalStrategy =require("passport-local"),
     Campgrounds   =require("./models/campgrounds"),
     User         = require("./models/user"),
     seedDB        =require("./seeds"),
     Comment       =require("./models/comment");

// seedDB();
app.use(require("express-session")({
     secret:"Once again Rusty wins cutest dog",
     resave:false,
     saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
     res.locals.currentUser= req.user;
     next();
})

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp_v6");


 
app.use(bodyparser.urlencoded({extended: true})); 
app.set("view engine", "ejs");                                // u dont have to write .ejs everywhere with file name
app.use(express.static(__dirname + "/public"));


// Campgrounds.create({
  //        name: "Mohan Sweets", 
  //         image: "https://images.unsplash.com/photo-1543773495-2cd9248a5bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN3ZWV0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
//           description:"this is soo sweeet!!, i cant eat it."       
           // } , function(err,campdrounds){
          //      if(err) console.log(err);
          //      else{
          //           console.log("new campgrounds");
          //           console.log(campgrounds);     
          //      }
                 
          
//         });

// var campgrounds=[
//      {name: "Mohan Sweets", image: "https://images.unsplash.com/photo-1543773495-2cd9248a5bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN3ZWV0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"},
//      {name: "burgirr", image: "https://images.unsplash.com/photo-1491960693564-421771d727d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJ1cmdlciUyMHJlc3RydWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"},
//      {name: "Biriyaniiiii", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJpcml5YW5pfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"}
//     ]

app.get("/",isLoggedIn,function(req,res){                                // server 1
    
     res.render("landing");
});

app.get("/campgrounds", function(req, res) {               //INDEX route   
     Campgrounds.find({})
       .then(function(allCampgrounds) {
         res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user});
       })
       .catch(function(err) {
         console.log(err);
       });
   });
   

   app.get("/campgrounds/new",isLoggedIn,function(req,res){                 //NEW route
     res.render("campgrounds/new");
});

app.post("/campgrounds",function(req,res){               //CREATE route
     var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
     var author={
          id:req.user._id,
          username:req.user.username
     }
    var newcampground={name: name, image:image, description:description, author:author}
    Campgrounds.create(newcampground)
     .then(function(newcampground)
     {
          res.redirect("/campgrounds");
     })
     .catch(function(err){
          console.log(err);
     });
    
     
});

app.get("/campgrounds/:id",function(req,res){
     Campgrounds.findById(req.params.id).populate("comments").exec()
     .then(function(foundCampgrounds){
       // console.log(foundCampgrounds);
        res.render("campgrounds/show", {campgrounds:foundCampgrounds});  
     })
     .catch(function(err){ 
          console.log(err);
     });  
});


function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
          return next();
     }
     res.redirect("/login");
   }

// comments server
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
     Campgrounds.findById(req.params.id)
     .then(function(campground){
          res.render("comments/new",{campground:campground});
     })
     .catch(function(err){
          console.log(err);
     });  
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
     Campgrounds.findById(req.params.id)
     .then(function(campground){
         Comment.create(req.body.comment)
         .catch(function(err){
          console.log(err);
         })
         .then(function(comment){
           comment.author.id=req.user._id;
           comment.author.username=req.user.username;
           comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
         })
     })
     .catch(function(err){
          console.log(err);
         res.redirect("/campgrounds");
     });
});

app.get("/register", function(req,res){
     res.render("register");
});

app.post("/register", function(req,res){
        var newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, function(err,user){
          if(err){
               console.log(err);
               return res.render("register");
          }
          passport.authenticate("local")(req,res,function(){
               res.redirect("/campgrounds");
          });
        });
});

app.get("/login",function(req,res){
  res.render("login"); 
});

app.post("/login", passport.authenticate("local",
 { 
     successRedirect: "/campgrounds",
     failureRedirect:"/login"
}) ,function(req,res){ 
});

app.get("/logout", function(req, res) {
     req.logout(function(err) {
       if (err) {
         console.error(err);
       }
       // Successful logout, perform any additional actions here
       res.redirect("/campgrounds");
     });
   });

   function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
          return next();
     }
     res.redirect("/login");
   }
   
   
   
   
   
   












app.listen(900);