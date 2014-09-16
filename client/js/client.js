var map, featureLayer, walkersGroup, myself, myselfAccuracy;
var myselfLocated = false;

// ---------------------------------
// <TEMPLATES>
// ------------ mapbox -------------
Template.mapbox.created = function() {
  Walkers.find({}).observe({
    added: function(document) {
      var addedLayer = L.mapbox.featureLayer(document).on("click", function(e) {
        console.log('hello walker');
        //console.log(Walkers.findOne({geometry:{$elemMatch: {coordinates:[e.latlng.lat, e.latlng.lng]}}}));
      });
      walkersGroup.addLayer(addedLayer);
    },
    removed: function() {
      //
    }
  });
};

Template.mapbox.rendered = function() {
  map = L.mapbox.map('mapbox-map', 'radd.map-ks1euj35', {
    tileLayer: {
      detectRetina: true
    }
  }).setView([48.857, 2.345], 12);
  walkersGroup = L.layerGroup().addTo(map);
  // Feature Layer init with shops.
  featureLayer = L.mapbox.featureLayer()
    .loadURL('oasis.geojson')
    .addTo(map).on('click', function(e) {
      //console.log('hello oasis');
      var circleMaker = L.circle(e.layer.getLatLng(), 2000, {
        stroke: true,
        color: "#b30087",
        weight: 1,
        fillColor: "#b30087"
      }).addTo(map);
      var bounds = circleMaker.getBounds();
      var inBounds = [];
      walkersGroup.eachLayer(function(layer) {
        console.log(layer);
      });
    });

  myself = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-color': '#b30087',
    })
  }).addTo(map);

  myselfAccuracy = L.circle([0, 0], 0, {
    stroke: false
  }).addTo(map);

  navigator.geolocation.watchPosition(updateCurrentPosition, function(error) {
    // You can detect the reason and alert it; I chose not to.
    //alertify.error("We could not get your location");
  }, {
    timeout: 5000,
    maximumAge: 600000,
    enableHighAccuracy: true
  });
};

// ------------ navbar -------------
Template.navbar.events({
  'click .add-me': function(evt) {
    Meteor.call('addRandom');
    evt.preventDefault();
  },
  'click .clear-all': function(evt) {
    Meteor.call('clearMongo');
    evt.preventDefault();
  }
});
// </TEMPLATES>
// ---------------------------------


// ---------------------------------
// <SUBSCRIBES>
Meteor.subscribe('allWalkers');

// </SUBSCRIBES>
// ---------------------------------

updateCurrentPosition = function(pos) {
  var lat = pos.coords.latitude;
  var lon = pos.coords.longitude;
  var accuracy = parseInt(pos.coords.accuracy);
  myself.setLatLng([lat, lon]).closePopup().unbindPopup().bindPopup('<br/><h4>Accuracy: ' + accuracy + 'm</h4>');
  if (!myselfLocated) {
    map.setView([lat, lon], 16);
    myselfLocated = true;
  }
  myselfAccuracy.setLatLng([lat, lon]).setRadius(accuracy);
}