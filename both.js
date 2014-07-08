Walkers = new Meteor.Collection('walkers');

// Custom functions below.
randomIntFromInterval = function (min,max) {
    return Math.random() * (max - min) + min;
}