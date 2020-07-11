var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"), 
	seedDB        = require("./seeds"),
	User          = require("./models/user"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local");


var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");


seedDB();
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect("mongodb://localhost/yelp_camp")

var Campground = require("./models/campground");
var Comment   = require("./models/comments");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again rusty wins cutest dog",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",authRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server Has Started");
});