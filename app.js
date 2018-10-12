var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    Campground=require("./models/campground"),
    User=require("./models/user")
    Comment=require("./models/comment"),
    seedDB=require("./seeds");

    seedDB();
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



    mongoose.connect('mongodb://localhost/yelp_camp');

    app.use(bodyParser.urlencoded({extended:true}));
    app.set('view engine','ejs');
    app.use(express.static(__dirname+"/public"));
    console.log(__dirname);
    

var campgrounds =[
    {name:'salmon',image:'https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg'},
    {name:'kuay',image:'https://farm2.staticflickr.com/1266/973330600_c1360f7cd3.jpg'},
    {name:'hee',image:'https://pixabay.com/get/e835b20e29f7083ed1584d05fb1d4e97e07ee3d21cac104496f6c27fa2ebb1ba_340.jpg'},
    {name:'salmon',image:'https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg'},
    {name:'kuay',image:'https://farm2.staticflickr.com/1266/973330600_c1360f7cd3.jpg'},
    {name:'hee',image:'https://pixabay.com/get/e835b20e29f7083ed1584d05fb1d4e97e07ee3d21cac104496f6c27fa2ebb1ba_340.jpg'},
    {name:'salmon',image:'https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg'},
    {name:'kuay',image:'https://farm2.staticflickr.com/1266/973330600_c1360f7cd3.jpg'},
    {name:'hee',image:'https://pixabay.com/get/e835b20e29f7083ed1584d05fb1d4e97e07ee3d21cac104496f6c27fa2ebb1ba_340.jpg'}
];

// schemaSetup


// Campground.create({
//     name:'salmon',image:'https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg',description:"you are my sun shine"
//     },function(err,campground){
//         if(err){
//             console.log("Error Jaaa");
//             console.log(err);
//         }else{
//             console.log("New Create Campground");
//             console.log(campground)
//         }
//     });

app.get('/',function(req,res){
    res.render('landing');
});
app.get('/campgrounds',function(req,res){
    console.log(req.user);
    // Get All campground from db
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        // campgrounds ไม้ใช่ array แล้ว
            res.render('campgrounds/index',{campgrounds:allcampgrounds, currentUser:req.user});     
    });
    // res.render('campgrounds',{campgrounds:campgrounds});
});
app.get('/campgrounds/new',function(req,res){
    res.render('campgrounds/new');
});
app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newcamp={name:name, image:image,description:desc};
    // console.log(newcamp);
    Campground.create(newcamp,function(err,newlyCampground){
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds');
        }
    })
    // campgrounds.push(newcamp);
    // res.redirect('/campgrounds');
});
app.get('/campgrounds/:id',function(req,res){
// อันนี้มันจะถึง comment ใน id นั้นๆออกมา   
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    // Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
})
// ==============================================
// Comment Route
// ==============================================
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});
app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);

                }
            });
            console.log(req.body.campground)
        }
    });
});

// autheniticate route
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    });
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res){

});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("connected");
});