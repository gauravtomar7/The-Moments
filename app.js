var express        =require("express"),
     app           =express(),
     bodyparser    =require("body-parser"),
     mongoose      =require("mongoose"),
     passport      =require("passport"),
     LocalStrategy =require("passport-local"),
     methodOverride= require("method-override"),  
     Campgrounds   =require("./models/campgrounds"),
     User         = require("./models/user"),
     flash        = require("connect-flash")
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
app.use(flash());
app.use(function(req,res,next){
     res.locals.currentUser= req.user;
     res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
     next();
})

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp_v6");


 
app.use(bodyparser.urlencoded({extended: true})); 
app.set("view engine", "ejs");                                // u dont have to write .ejs everywhere with file name
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.get("/",function(req,res){                           //GET     // server 1
    
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


function isLoggedIn(req,res,next){                                        //midelwire
     if(req.isAuthenticated()){                                             //flash
          return next();
     }
     req.flash("error","You need to be logged-in first!");                 
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

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){           //create comments
     Campgrounds.findById(req.params.id)
     .then(function(campground){
         Comment.create(req.body.comment)
         .catch(function(err){
          req.flash("error", "Something went wrong :(");
          console.log(err);
         })
         .then(function(comment){
           comment.author.id=req.user._id;
           comment.author.username=req.user.username;
           comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added a new comment!");  
          res.redirect('/campgrounds/' + campground._id);
         })
     })
     .catch(function(err){
          console.log(err);
         res.redirect("/campgrounds");
     });
});

// app.get("/campgrounds/:comment_id/edit",function(req,res){                     //comments edit

//      res.render("campgrounds/edit");
// });

app.get("/register", function(req,res){
     res.render("register");
});

app.post("/register", function(req,res){                                       //register
        var newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, function(err,user){
          if(err){ 
               req.flash("error", err.message);
               return res.render("register");
          }
          passport.authenticate("local")(req,res,function(){
               req.flash("success", "Welcome " + user.username);
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
       req.flash("success","Logged you out");
       res.redirect("/campgrounds");
     });
   });

   //edit 
   app.get("/campgrounds/:id/edit",check ,function(req,res){                   //check
     Campgrounds.findById(req.params.id)
     .then(function(foundCampgrounds){
          res.render("campgrounds/edit",{campground:foundCampgrounds});
     })
     .catch(function(err){
          console.log(err);
         res.redirect("/campgrounds");
     });  
     
   })
     //is user logged in
     
   //update
      app.put("/campgrounds/:id",check,function(req,res){                      //check
          
          Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground)
          .then(function(updatedCampgrounds){
               res.redirect("/campgrounds/" + req.params.id);
          })
          .catch(function(err){
               console.log(err);
          })
      });

      //destroy
      app.delete("/campgrounds/:id",check,function(req,res){               //check
          Campgrounds.findByIdAndRemove(req.params.id)
          .then(function(removeCampgrounds){
               res.redirect("/campgrounds");

          })
          .catch(function(err){
               res.redirect("/campgrounds");
          })

      });



//    function isLoggedIn(req,res,next){
     
//      if(req.isAuthenticated()){
//           return next();
//      }
//      req.flash("error"," you need to be logged-in first!");
//      res.redirect("/login");  
//}    

     function check(req,res,next){
          if(req.isAuthenticated()){   
               Campgrounds.findById(req.params.id)
                         .catch(function(err){
                              req.flash("error", "Campground not found");
                            res.redirect("back");
                         })
     
                         .then(function(foundCampgrounds){
                           //does user own the campgrounds
                              if (foundCampgrounds && foundCampgrounds.author && foundCampgrounds.author.id && req.user && req.user._id && foundCampgrounds.author.id.equals(req.user._id)) {
       // Correctly populated, proceed with rendering the edit page
                                   next();
                              }
                              else{
                                   req.flash("error", "Permission denied !!");
                                  res.redirect("back");
                              }
                         }) 
                    
          }
          else {
               req.flash("error", "You need to be logged-in first!");
               res.redirect("back"); 
          }
          
              
          };
          
     
    
   
   
   
   
   
   












app.listen(900);