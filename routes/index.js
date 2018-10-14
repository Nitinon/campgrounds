var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
router.get('/',function(req,res){
    // console.log(req.user==undefined);
    if(req.user) console.log(req.user.email);


    res.render('landing');
});
// ==============================================
// Comment Route
// ==============================================


// autheniticate route
router.get("/register",function(req,res){
    res.render("register");
});
router.post("/register",function(req,res){
    var user = new User({email:req.body.email});
    user.save(function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            user.username=req.body.username;
            
    User.register(user,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
            passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
        }
});
    // var newUser=new User({username:req.body.username});
    // // ใช้ find one ถ้ามี email ซ้ำก็บึ้ม


    // User.register(newUser,req.body.password,function(err,user){
    //     if(err){
    //         console.log(err);
    //         return res.render("register");
    //     }
    //     user.email=req.body.email;
    //     user.save(function(err){
    //         if(err){
    //             console.log(err);
    //             res.redirect("/campgrounds");

    //         }else{
    //             passport.authenticate("local")(req,res,function(){
    //                 res.redirect("/campgrounds");
    //             });
    //         }
    //     });
    // });
});
router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
        // failureFlash: true
    })
);
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;