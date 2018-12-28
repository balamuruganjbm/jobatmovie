var express = require("express");
var router  = express.Router();
var Movies  = require("../models/movielist");
var middlewareObj = require("../middleware");
var multer  = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'imnotjbm', 
  api_key: 492889576423135, 
  api_secret:  'vc-U-kSc22Khzp9p7GtUkYDrwEw'
});

//Index Route
router.get("/",middlewareObj.isLoggedin,function(req, res) {
    Movies.find({},function(err,movies){
       if(err)
        res.render("/");
        else
            res.render("movielist/index",{movies: movies, currentUser:req.user});          
    });
   
});
//POST Index route
router.post("/",middlewareObj.isLoggedin,upload.single('image'),function(req,res){
    cloudinary.v2.uploader.upload(req.file.path,  {timeout:60000},function(err,result) {
    if(err)
       {
            req.flash('error', err.message);
            return res.redirect('back');
       }
        req.body.movie.image = result.secure_url;
        req.body.movie.imageId = result.public_id;
        // add author to movie
        req.body.movie.author = {
            id: req.user._id,
            username: req.user.username
        };
    Movies.create(req.body.movie,function(err,movies){
       if(err)
       {
            req.flash('error', err.message);
            return res.redirect('back');
       }
       else
       {
        req.flash("Movie successfully added");
        res.redirect("/movielist");     
       }
    });
});
});
//NEW add new movie
router.get("/new",middlewareObj.isLoggedin,function(req, res) {
    res.render("movielist/new");
});

//SHOW route
router.get("/:id",middlewareObj.isLoggedin,function(req, res) {
    Movies.findById(req.params.id).populate("comment").exec(function(err,movie){
     if(err)
        res.redirect("/");
      else
        res.render("movielist/show",{movie:movie});
   }); 
});

//Edit route
router.get("/:id/edit",middlewareObj.checkMovieOwner,function(req, res) {
    Movies.findById(req.params.id,function(err,foundmovie){
        if(err)
            res.redirec("/movielist");
        else
        {
             res.render("movielist/edit",{movie:foundmovie}); 
        }
        });
});
//UPDATE route
router.put("/:id",middlewareObj.checkMovieOwner,upload.single('image'),function(req,res){
   Movies.findById(req.params.id, async function(err,updatedmovie){
        if(err)
        {
        res.redirect("/movielist");
        }
        else
        {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(updatedmovie.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  updatedmovie.imageId = result.public_id;
                  updatedmovie.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            updatedmovie.moviename = req.body.movie.moviename;
            updatedmovie.description = req.body.movie.description;
            updatedmovie.save();
            req.flash("success","Successfully updated");
            res.redirect("/movielist/"+req.params.id);
     }
   });
});

//DESTROY route
router.delete("/:id",middlewareObj.checkMovieOwner,function(req,res){
   Movies.findById(req.params.id,async function(err,post){
      if(err){
        req.flash("error", err.message);
        res.redirect("/movielist");
      }
      else
      {
        try {
        await cloudinary.v2.uploader.destroy(post.imageId);
        post.remove();
        req.flash('success', 'Movie deleted successfully!');
        res.redirect('/movielist');
        } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
      }
      }
   }); 
});



module.exports = router;