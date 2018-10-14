var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
// ไม่ต้อง /index เพราะมัน speacial name

router.get('/',function(req,res){
    // console.log(req.user);
    // Get All campground from db
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        // campgrounds ไม้ใช่ array แล้ว
            res.render('campgrounds/index',{campgrounds:allcampgrounds});     
    });
    // res.render('campgrounds',{campgrounds:campgrounds});
});
router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new');
});
router.post('/',middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newcamp={name:name, image:image,description:desc,author:author};
    // console.log(newcamp);
    Campground.create(newcamp,function(err,newlyCampground){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCampground);
            res.redirect('/');
        }
    })
    // campgrounds.push(newcamp);
    // res.redirect('/campgrounds');
});
router.get('/:id',function(req,res){
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
});

    // Edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundedCampground){
        res.render("campgrounds/edit",{campground:foundedCampground});
    }); 
});
    // UPDATE
router.put("/:id",function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// destroy ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }
// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id,function(err,foundCampground){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     }else{
//         res.redirect("back");
//     }
// }
module.exports=router;