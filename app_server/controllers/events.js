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
/*
var renderHomepage = function(req, res, responseBody){
res.render('locations-list', {
title: 'Utogether - find your friends',
pageHeader: {
title: 'Utogether',
strapline: 'Help you find your friends'
},
sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
events: responseBody
});
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
renderHomepage(req, res);
}
);
};
*/