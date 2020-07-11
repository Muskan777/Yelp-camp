var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX - show all campgrounds
router.get("/", function(req, res) {
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
router.post("/", function(req,res) {
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
router.get("/new", function(req,res) {
	res.render("campgrounds/new");
});

//show route
router.get("/:id", function(req,res) {
	//find the campground with provided 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show",{Campgrounds: foundCampground});
		}
	});
})


module.exports = router;