var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    User            = require("./models/user"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");
    
var commRoutes  = require("./routes/comments"),
    campRoutes  = require("./routes/campgrounds"),
    authRoutes  = require("./routes/index");
    
var url = process.env.DBURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
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
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.danger       = req.flash("danger");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("yelpcamp running");
});