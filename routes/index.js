var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport= require("passport");
    
router.get("/", function(req, res) {
    res.render("landing");
});

//Auth Routes
router.get("/register", function(req, res) {
    res.render("register");
});

//register form
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Registration complete. Welcome, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    })
});

//login form
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;