var request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://polar-river-81614.herokuapp.com";
}

/* GET 'home' page */
// module.exports.eventsList = function(req, res){
// res.render('eventslist', { 
//     title: 'Event List',
//     events: [{
//         title: 'Pumpkin Carving Night',
//         date: '23 October 2019',
//         time: '5:30pm',
//         location: '1800 Lavaca St, Austin, TX 78701',
//         coords: [-97.741202, 30.280824],
//         category: 'culture',
//         description: "Join us Halloween Night! Join PALS for a ghostly night of pumpkin carving! Don't miss out on this treat!"
//     },
//     {
//         title: 'Introduction to Authentic Chinese Food',
//         date: '13 October 2019',
//         time: '1:10pm',
//         location: '1914 Guadalupe St, Austin, TX 78705',
//         coords: [-97.742457, 30.282683],
//         category: 'food',
//         description: "Join us Halloween Night! Join PALS for a ghostly night of pumpkin carving! Don't miss out on this treat!"
//     },
//     {
//         title: 'International Faculty & Scholars Social Hour',
//         date: '9 October 2019',
//         time: '10:00am',
//         location: '201 W 21st St, Austin, TX 78705',
//         coords: [-97.739604, 30.284067],
//         category: 'culture',
//         description: "Join us Halloween Night! Join PALS for a ghostly night of pumpkin carving! Don't miss out on this treat!"
//     }]
//  });
// };
var renderHomepage = function(req, res, responseBody){
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } 
    else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }
    res.render('eventslist', {
        // title: 'Utogether - find your friends',
        pageHeader: {
            title: 'Utogether'
            // strapline: 'Help you find your friends'
        },
        // sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        events: responseBody,
        message: message
    });
};

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
    var numDistance;
    if (_isNumeric(distance)) {
        if (distance > 1) {
          numDistance = parseFloat(distance).toFixed(1);//If supplied distance is over 1, round to one decimal place
          return numDistance + ' m';
        } else {
          numDistance = parseInt(distance,10);//Otherwise round to nearest meter
          return numDistance + ' m';
        }
    } else {
        console.log("the distance is:" + distance);
        return "?";
    }
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

module.exports.eventsList = function(req, res){
    var requestOptions, path;
    path = '/api/events';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {
            lng : -97.742457,
            lat : 30.282683,
            // lng : -97.741202,
            // lat : 30.280824,
            maxDistance : 20
        }
    };
    request(
        requestOptions,
        function(err, response, body) {
            var i, data;
            data = body;
            console.log(data);
            if (response.statusCode === 200 && data.length) {
                for (i=0; i<data.length; i++) {
                    data[i].distance = _formatDistance(data[i].distance);
                }
            }
            renderHomepage(req, res, data);
        }
    );
};

// module.exports.myEvent = function(req, res){
//     res.render('index', { title: 'My Events' });
// };

module.exports.doAddEvent = function(req, res){
    // var requestOptions, path, eventid, postdata;
    var requestOptions, postdata;
    // eventid = req.params.eventid;
    // path = "/api/events/" + eventid + '/comments';
    path = "/api/mynewevent";
    postdata = {
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        coords: req.body.coords,
        category: req.body.category,
        description: req.body.description
    };
    requestOptions = {
        url : apiOptions.server + path,
        // url : apiOptions.server,
        method : "POST",
        json : postdata
    };
    if (!postdata.title || !postdata.date || !postdata.time || !postdata.location || !postdata.coords || !postdata.category || !postdata.description) {
        res.redirect('/mynewevent/new?err=val');
    } 
    else {
        request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    res.redirect('/events');
                } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                    res.redirect('/mynewevent/new?err=val');
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};

var renderEventForm = function (req, res) {
    res.render('addevent', {
        title: 'New Event',
        pageHeader: { title: 'Event'},
        error: req.query.err
    });
};

/* GET 'Add event' page */
module.exports.addEvent = function(req, res){
    renderEventForm(req, res);
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
    if (!postdata.author || !postdata.commentText) {
        res.redirect('/events/' + eventid + '/comments/new?err=val');
    } 
    else {
        request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    res.redirect('/events/' + eventid);
                } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                    res.redirect('/events/' + eventid + '/comments/new?err=val');
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};

var renderCommentForm = function (req, res, eventDetail) {
    res.render('eventCommentForm', {
        title: 'Comment ' + eventDetail.title + ' on UTogether',
        pageHeader: { title: 'Comment '+ eventDetail.title },
        error: req.query.err
    });
};

module.exports.addComment = function(req, res){
    getEventInfo(req, res, function(req, res, responseData) {
        renderCommentForm(req, res, responseData);
    });
};

var renderDetailPage = function (req, res, eventDetail) {
    res.render('eventinfo', {
        event: eventDetail
    });
};

/* GET 'Add review' page */
var getEventInfo = function (req, res, callback) {
    var requestOptions, path;
    console.log(req.params.eventid);
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
            console.log(data);
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

module.exports.eventInfo = function(req, res){
    getEventInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};