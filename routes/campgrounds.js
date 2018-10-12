var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");

router.get('/campgrounds',function(req,res){
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
router.get('/campgrounds/new',function(req,res){
    res.render('campgrounds/new');
});
router.post('/campgrounds',function(req,res){
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
router.get('/campgrounds/:id',function(req,res){
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
module.exports=router;