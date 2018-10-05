var Movies  = require("../models/movielist");
var Comment = require("../models/comment");
var middlewareObj={};
middlewareObj.checkMovieOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Movies.findById(req.params.id,function(err, foundmovie) {
           if(err){
            res.redirect("/movielist");
           }
            else
            {
                if(foundmovie.author.id.equals(req.user._id)){
                     next();
                }
                else{
                     req.flash("danger","you don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }    
};

middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundcomment) {
           if(err){
            res.redirect("/movielist");
           }
            else
            {
                if(foundcomment.author.id.equals(req.user._id)){
                     next();
                }
                else{
                    req.flash("danger","you don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }    
};

middlewareObj.isLoggedin = function (req,res,next){
  if(req.isAuthenticated()){
      return next();
  }  
  else

    req.flash("danger","You must log in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;