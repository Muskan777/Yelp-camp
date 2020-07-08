var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comments");

var data = [
	{name: "Cloud's Rest",
	 image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	 description: "Superfรณnicos. Before the coronavirus pandemic upended our lives, the eight-piece Colombian funk and Caribe soul outfit had grand plans to drop its debut album this spring. The project is temporarily stalled, but last month, the band dropped the first single from the record, El Adios. Produced by Jim Eno (Spoon), the song is an emotional examination of the immigrant experience inspired by a conversation between bassist Nico Sanchez and his father, a Colombian immigrant, about the events that forced him to leave his homeland"
	},
	{name: "Resting Soul",
	 image: "https://r-cf.bstatic.com/images/hotel/max1024x768/226/226478359.jpg",
	 description: "Superfรณnicos. Before the coronavirus pandemic upended our lives, the eight-piece Colombian funk and Caribe soul outfit had grand plans to drop its debut album this spring. The project is temporarily stalled, but last month, the band dropped the first single from the record, El Adios. Produced by Jim Eno (Spoon), the song is an emotional examination of the immigrant experience inspired by a conversation between bassist Nico Sanchez and his father, a Colombian immigrant, about the events that forced him to leave his homeland"
	},
	{name: "Heaven on Earth",
	 image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSjWaptzeyiCKHQO1Ee9lnuHu7mCrsnp86w0w&usqp=CAU",
	 description: "Superfรณnicos. Before the coronavirus pandemic upended our lives, the eight-piece Colombian funk and Caribe soul outfit had grand plans to drop its debut album this spring. The project is temporarily stalled, but last month, the band dropped the first single from the record, El Adios. Produced by Jim Eno (Spoon), the song is an emotional examination of the immigrant experience inspired by a conversation between bassist Nico Sanchez and his father, a Colombian immigrant, about the events that forced him to leave his homeland"
	}
]

function seedDB() {
	//remove all campgrounds
	Campground.remove({}, function(err) {
		if(err) {
			console.log(err);
		}
		console.log("removed campgrounds");
		//remove all comments
		Comment.remove({}, function(err) {
			if(err) {
				console.log(err);
			}
			console.log("removed comments");
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if(err) {
						console.log(err);
					}
					else {
						console.log("added to campgrounds");
						//create a comment
						Comment.create(
						{
							text: "This place is great, but I wish there was internet",
							author: "Homer"
						}, function(err, comment) {
							if(err) {
								console.log(err);
							}
							else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}
						});
					}
				});
			});
		});
	})
}

module.exports = seedDB;



