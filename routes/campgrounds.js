var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campground");

//index
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//create
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});


//new
router.get("/new", isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});


//show more
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground
router.get("/:id/edit", checkOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
        }
        res.render("campgrounds/edit", {campground: foundCamp});
    });
})

//update campground;
router.put("/:id", checkOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//destroy campground;
router.delete("/:id", checkOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkOwner(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if(err) {
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
module.exports = router;