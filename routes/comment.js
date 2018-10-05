var express = require("express");
var router  = express.Router({mergeParams: true});
var Movies    = require("../models/movielist");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");
//Comment route
router.get("/new",middlewareObj.isLoggedin,function(req, res) {
   Movies.findById(req.params.id,function(err,movie){
      if(err)
        res.redirect("/");
      else
        res.render("comment/new",{movie:movie});
   });
});
router.post("/",middlewareObj.isLoggedin,function(req,res){
    Movies.findById(req.params.id,function(err, movie) {
       if(err)
        res.redirect("/");
       else
       {
           Comment.create(req.body.comment,function(err,comments){
              if(err)
                res.redirect("/");
              else
              {
                comments.author.id=req.user._id;
                comments.author.username=req.user.username;
                comments.save();
                movie.comment.push(comments);
                movie.save();
                 req.flash("success","Comment added successfully");
                res.redirect("/movielist/"+ movie._id);
              }
           });
       }
    });
});

//EDIT comment
router.get("/:comment_id/edit",middlewareObj.checkCommentOwner,function(req,res){
   Comment.findById(req.params.comment_id,function(err,foundcomment) {
      if(err)
      {
          res.redirect("back");
      }
      else
      {
        res.render("comment/edit",{movie_id:req.params.id,comment:foundcomment});       
      }
   });
    
});

//UPDATE comment
router.put("/:comment_id",middlewareObj.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err) 
            res.redirect("/");
        else
        {
             req.flash("success","Comment updated successfully");
            res.redirect("/movielist/"+req.params.id);
        }
    });
});
//DESTROY comment
router.delete("/:comment_id",middlewareObj.checkCommentOwner,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err)
        res.redirect("/movielist");
        else{
             req.flash("danger","comment deleted");
            res.redirect("/movielist/"+req.params.id);
        }
   }) ;
});

module.exports = router;