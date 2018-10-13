var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Movies        = require("./models/movielist"),
    User          = require("./models/user"),
    Comment       = require("./models/comment"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    flash         = require("connect-flash");
    
//Routes    
var movielistRoutes  = require("./routes/movielist"),
    commentsRoutes   = require("./routes/comment"),
    indexRoutes      = require("./routes/index");


//Database connect
mongoose.connect("mongodb://imnotjbm:jbmjbmjbm45@ds123603.mlab.com:23603/jobatdb",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
//Passport configration
app.use(require("express-session")({
   secret:"im not jbm",
   resave:false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req,res,next){
   res.locals.currentUser=req.user; 
   res.locals.danger = req.flash("danger");
   res.locals.success = req.flash("success");
   next();
});

//use routes
app.use(indexRoutes);
app.use("/movielist",movielistRoutes);
app.use("/movielist/:id/comment",commentsRoutes);


app.get("*",function(req,res){
    res.redirect("/");
});

//Listen Port
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("JOBAT Maniac app server started..!") 
});