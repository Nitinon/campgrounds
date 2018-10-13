var express=require("express");
// ต้อง merge params
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");

router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});
router.post("/",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            // create คือสร้้างใหม่ save คือ update อันเดิม
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    console.log("New Commment By "+req.user.username);
                    // save comment 
                    comment.save();
                    // มันยัด comment เข้า campground
                    campground.comments.push(comment);
                    campground.save();
                    
                    console.log(comment);
                    res.redirect("/campgrounds/"+campground._id);

                }
            });
            // console.log(req.body.campground)
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;