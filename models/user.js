var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema=new mongoose.Schema({
    user: String,
    email :{type:String ,unique:true},
    password: String
}); 

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator);
module.exports=mongoose.model("User",UserSchema);