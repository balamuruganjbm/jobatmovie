var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");


//Routes
router.get("/",function(req,res){
    res.render("movielist/welcome");    
});

//SignUP routes
router.get("/signup",function(req, res) {
    res.render("signup");
});
router.post("/signup",function(req, res) {
     var newuser = new User({username:req.body.username});
     User.register(newuser,req.body.password,function(err,user){
      if(err){
       req.flash("danger",err.message);
        res.redirect("/");
      }
      else
      {
          passport.authenticate("local")(req,res,function(){
               req.flash("success","Welcome to jobat"+user.username);
            res.redirect("/movielist");    
          });
          
      }
   }); 
});

//Login routes
router.get("/login",function(req, res) {
   res.render("login"); 
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/movielist",
    failureRedirect:"/login"
}),function(req,res){
});

//log out route
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","logged out see you soon");
   res.redirect("/movielist");
});



module.exports = router;