var express    = require("express"),
    middleware = require("../middleware"),
    router     = express.Router({mergeParams: true}),
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
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var rate = req.body.rate;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, rate: rate, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Campground successfully created!");
            res.redirect("/campgrounds");
        }
    });
});


//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});


//show more
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground
router.get("/:id/edit", middleware.checkCgOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
        }
        res.render("campgrounds/edit", {campground: foundCamp});
    });
})

//update campground;
router.put("/:id", middleware.checkCgOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//destroy campground;
router.delete("/:id", middleware.checkCgOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "This isn't your campground!");
            res.redirect("/campgrounds");
        } else {
            req.flash("danger", "Campground successfully deleted");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;