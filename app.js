var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    Campground=require("./models/campground"),
    User=require("./models/user")
    Comment=require("./models/comment"),
    seedDB=require("./seeds");

var commentRoutes=require("./routes/comments"),
    indexRoutes=require("./routes/index"),
    campgroundRoutes=require("./routes/campgrounds");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

    console.log(__dirname);
    // comment seedDB
    // seedDB();

    
    app.use(require("express-session")({
        secret:"Once again Rusty wins cuest dog!",
        resave:false,
        saveUninitialized :false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    // rounte all Current use ไมทต้อวทำทีบะ single rounte
    app.use(function(req,res,next){
        res.locals.currentUser=req.user;
        next();
    });
    app.use(indexRoutes);
    app.use("/campgrounds",campgroundRoutes);
    // :id มันส่ง params มาไม่ได้เลยต้อง mergeParams
    app.use("/campgrounds/:id/comments",commentRoutes);
    
    
    


    // app.get('/',function(req,res){
    //     res.render('landing');
    // });
    // // ==============================================
    // // Comment Route
    // // ==============================================
    
    
    // // autheniticate route
    // app.get("/register",function(req,res){
    //     res.render("register");
    // });
    // app.post("/register",function(req,res){
    //     var newUser=new User({username:req.body.username});
    //     User.register(newUser,req.body.password,function(err,user){
    //         if(err){
    //             console.log(err);
    //             return res.render("register");
    //         }
    //         passport.authenticate("local")(req,res,function(){
    //             res.redirect("/campgrounds");
    //         })
    //     });
    // });
    // app.get("/login",function(req,res){
    //     res.render("login");
    // });
    // app.post("/login",passport.authenticate("local",
    //     {
    //         successRedirect:"/campgrounds",
    //         failureRedirect:"/login"
    //         // failureFlash: true
    //     })
    // );
    // app.get("/logout",function(req,res){
    //     req.logout();
    //     res.redirect("/campgrounds");
    // });
    // function isLoggedIn(req,res,next){
    //     if(req.isAuthenticated()){
    //         return next();
    //     }
    //     res.redirect("/login");
    // }

app.listen(3000,function(){
    console.log("connected");
});