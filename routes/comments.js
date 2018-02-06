var express     = require("express"),
    middleware  = require("../middleware"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");


//new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//post comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "Comment added!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    });
});

//edit comment
router.get("/:comment_id/edit", middleware.checkComOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if(err || !camp) {
            req.flash("error", "Cannot find that campground");
            return res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, comm) {
                if(err) {
                    res.redirect("/login");
                } else {
                    res.render("comments/edit", {campground: req.params.id, comment: comm})
                }
            });
        }
    });
});

//update comment
router.put("/:comment_id", middleware.checkComOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comm) {
        if(err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//delete comment
router.delete("/:comment_id", middleware.checkComOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;