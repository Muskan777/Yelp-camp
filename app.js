var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"), 
	seedDB        = require("./seeds"),
	User          = require("./models/user"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local");

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
	saveUnintialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.render("landing");
})

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
	//get all campgrounds from db
	Campground.find({}, function(err, allcampgrounds) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds: allcampgrounds});
		}
	});
})

//CREATE - Create new campgrounds and add to database 
app.post("/campgrounds", function(req,res) {
	//get data from from and add it to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name, image:image, description:description};
	//create new campground and save it to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		}
		else {
			//redirect back to the compgrounds page
			res.redirect("/campgrounds");
		}
	})
})

//NEW -  show form to create new campgrounds
app.get("/campgrounds/new", function(req,res) {
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req,res) {
	//find the campground with provided 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(foundCampground);
			res.render("campgrounds/show",{Campgrounds: foundCampground});
		}
	});
})

//======================
//	COMMENTS ROUTES
//======================
app.get("/campgrounds/:id/comments/new", function(req,res) {
	//find campground by id
	Campground.findById(req.params.id, function(err,campground) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("comments/new",{campground:campground});
		}
	})
})

app.post("/campgrounds/:id/comments", function(req,res) {
	//lookup campgrounds using id
	Campground.findById(req.params.id, function(err,campground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				}
				else {
					//add new comments
					//connect new comment to campground
					//redirect back to campground show page
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+ campground._id);
				}
			})	
		}
	})
	
})

//================
//AUTH ROUTES
//================

///register
app.get("/register", function(req,res) {
	res.render("register");
});

app.post("/register", function(req,res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user) {
		if(err) {
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});
	});
});


//login
app.get("/login", function(req,res) {
	res.render("login")	
});

app.post("/login",passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}) ,function(req,res) {
});

//logout
app.get("/logout", )

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server Has Started");
});