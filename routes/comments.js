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

router.get("/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            // โยน camp id กับ comment ที่เจอเข้าไป
            res.render("comments/edit",{campground_id : req.params.id,comment:foundComment});
        }
    });
});
router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedCommet){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
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