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
        location: '123 Lavaca St',
        distance: '100m'
    },
    {
        title: 'Introduction to Authentic Chinese Food',
        date: '10/13/2017',
        time: '13:10',
        joined: '29 joined',
        location: '1234 Lavaca St',
        distance: '200m'
    },
    {
        title: 'International Faculty & Scholars Social Hour',
        date: '10/9/2017',
        time: '10:00',
        joined: '10 joined',
        location: '12345 Lavaca St',
        distance: '250m'
    }]
 });
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
res.render('events-list', {
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

module.exports.doAddComment = function(req, res){
    var requestOptions, path, eventid, postdata;
    eventid = req.params.eventid;
    path = "/api/events/" + eventid + '/comments';
    postdata = {
        author: req.body.name,
        commentText: req.body.comment
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/event/' + eventid);
            } else {
            _showError(req, res, response.statusCode);
            }
        }
    );
};

/* GET 'Add review' page */
module.exports.addComment = function(req, res){
renderCommentForm(req, res);
};

var renderCommentForm = function (req, res, locDetail) {
res.render('event-comment-form', {
title: 'Comment '+locDetail.name+' on Loc8r',
pageHeader: { title: 'Comment '+locDetail.name }
});
};

/* GET 'Add review' page */
var getEventInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "/api/events/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
            data.coords = {
                lng : body.coords[0],
                lat : body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }
        }
    );
};

var renderDetailPage = function (req, res, locDetail) {
res.render('event-info', {
title: locDetail.name,
pageHeader: {title: locDetail.name},
sidebar: {
context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
},
event: locDetail
});
};

module.exports.eventInfo = function(req, res){
    var requestOptions, path;
    path = "/api/events/" + req.params.eventid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderDetailPage(req, res);
        }
    );
};

var renderCommentForm = function (req, res) {
    res.render('event-comment-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: { title: 'Review Starcups' }
    });
};

module.exports.addComment = function(req, res){
    getEventInfo(req, res, function(req, res, responseData) {
        renderCommentForm(req, res, responseData);
    });
};