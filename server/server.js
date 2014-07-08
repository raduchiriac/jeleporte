// ---------------------------------
// <METHODS>
Meteor.methods({
  addRandom: function() {
    var _id = Walkers.insert({
      "type": "Feature",
      "properties": {
      	title: 'A Walker',
        description: "I don't remember who I am",
        'marker-size': 'large',
        'marker-color': '#'+Math.floor(Math.random()*16777215).toString(16),
        'marker-symbol': 'mobilephone',
        'marker-class':'dot'
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          randomIntFromInterval(2.265, 2.4104),
          randomIntFromInterval(48.820, 48.900)
        ]
      }
    }, function(error, id) {
    	console.log('walker added', id);
    });
    return true;
  },
  clearMongo: function() {
  	Walkers.remove({});
  	return true;
  }
});
// </METHODS>
// ---------------------------------

// Manual Publishing after "remove autopublish" smart package
Meteor.publish('allWalkers', function () {
	return Walkers.find({});
});

Meteor.startup(function () {
  //Clean mongoDB on start?
});