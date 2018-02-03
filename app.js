var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    User        = require("./models/user"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override");
    
var commRoutes  = require("./routes/comments"),
    campRoutes  = require("./routes/campgrounds"),
    authRoutes  = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// seedDB();

//Passport Config
app.use(require("express-session") ({
    secret: "I am in love with Yvette, miannn",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("yelpcamp running");
});