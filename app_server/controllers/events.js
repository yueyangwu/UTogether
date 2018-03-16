var request = require('request');
var apiOptions = {
server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
apiOptions.server = "https://polar-river-81614.herokuapp.com/";
}
/* GET 'home' page */
module.exports.eventsList = function(req, res){
res.render('eventslist', { 
    title: 'Event List',
    events: [{
        title: 'Pumpkin Carving Night',
        date: '10/23/2017',
        time: '17:30',
        joined: '18 joined',
        distance: '100m'
    },
    {
        title: 'Introduction to Authentic Chinese Food',
        date: '10/13/2017',
        time: '13:10',
        joined: '29 joined',
        distance: '200m'
    },
    {
        title: 'International Faculty & Scholars Social Hour',
        date: '10/9/2017',
        time: '10:00',
        joined: '10 joined',
        distance: '250m'
    }]
 });
};
/* GET 'Event info' page */
module.exports.eventInfo = function(req, res){
res.render('eventinfo', { title: 'Location Info' });
};
/* GET 'Add event' page */
module.exports.addEvent = function(req, res){
res.render('addevent', { title: 'Add Event' });
};
module.exports.myEvent = function(req, res){
res.render('index', { title: 'My Events' });
};

var renderHomepage = function(req, res, responseBody){
var message;
if (!(responseBody instanceof Array)) {
message = "API lookup error";
responseBody = [];
} else {
if (!responseBody.length) {
message = "No places found nearby";
}
}

res.render('locations-list', {
title: 'Utogether - find your friends',
pageHeader: {
title: 'Utogether',
strapline: 'Help you find your friends'
},
sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
events: responseBody,
message: message
});
};

var _formatDistance = function (distance) {
var numDistance, unit;
if (distance > 1) {
numDistance = parseFloat(distance).toFixed(1);
unit = 'km';
} else {
numDistance = parseInt(distance * 1000,10);
unit = 'm';
}
return numDistance + unit;
};

module.exports.homelist = function(req, res){
var requestOptions, path;
path = '/api/events';
requestOptions = {
url : apiOptions.server + path,
method : "GET",
json : {},
qs : {
lng : -0.7992599,
lat : 51.378091,
maxDistance : 20
}
};
request(
requestOptions,
function(err, response, body) {
    var i, data;
    data = body;
    if (response.statusCode === 200 && data.length) {
        for (i=0; i<data.length; i++) {
            data[i].distance = _formatDistance(data[i].distance);
        }
    }
    renderHomepage(req, res, data);
}
);
};