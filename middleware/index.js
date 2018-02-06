var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
var middlewareObj = {
    checkCgOwner: function(req, res, next) {
        if(req.isAuthenticated()) {
            Campground.findById(req.params.id, function(err, foundCamp) {
                if(err || !foundCamp) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    if(foundCamp.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "That isn't your campground");
                        res.redirect("/campgrounds");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    },
    
    checkComOwner: function(req, res, next) {
        if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, comm) {
                if(err || !comm) {
                    req.flash("error", "Comment does not exist");
                    res.redirect("back");
                } else {
                    if(comm.author.id.equals(req.user._id)) {
                        next();
                    } else {    
                        res.redirect("back");
                    }   
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },
    
    
    isLoggedIn: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You gotta be logged in to do that!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;