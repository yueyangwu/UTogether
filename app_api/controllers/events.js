var mongoose = require('mongoose');
var Ut = mongoose.model('Event');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

// module.exports.eventsDeleteOne = function(req, res) {
//     var eventid = req.params.eventid;
//     if (eventid) {
//         Ut
//         .findByIdAndRemove(eventid)
//         .exec(
//         function(err, event) {
//             if (err) {
//                 sendJsonResponse(res, 404, err);
//                 return;
//             }
//             sendJsonResponse(res, 204, null);
//         }
//         );
//     } 
//     else {
//         sendJsonResponse(res, 404, {
//             "message": "No eventid"
//         });
//     }
// };

module.exports.eventsReadOne = function(req, res) {
    console.log('Finding event details', req.param);
    if (req.params && req.params.eventid) {
        Ut
            .findById(req.params.eventid)
            .exec(function(err, event) {
                if (!event) {
                    sendJsonResponse(res, 404, {
                        "message": "Oops,eventid not found"
                    });
                    return;
                } 
                else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, event);
            });
    } 
    else {
        sendJsonResponse(res, 404, {
            "message": "No eventid in request"
        });
    }
};

// var theEarth = (function(){
//     var earthRadius = 6371*1000; // m, miles is 3959
//     var getDistanceFromRads = function(rads) {
//         return parseFloat(rads * earthRadius);
//     };
//     var getRadsFromDistance = function(distance) {
//         return parseFloat(distance / earthRadius);
//     };
//     return {
//         getDistanceFromRads : getDistanceFromRads,
//         getRadsFromDistance : getRadsFromDistance
//     };
// })();

module.exports.eventsListByDistance = function(req, res) {
    console.log('eventsListByDistance:');
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    console.log('coordinates: ' + point.coordinates)
    if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
        console.log('eventsListByDistance missing params');
        sendJSONresponse(res, 404, {
          "message": "lng, lat and maxDistance query parameters are all required"
        });
        return;
    }
    else{
        console.log('locationsListByDistance running...');
        Ut.aggregate(
            [{
                '$geoNear': {
                    'near':point,
                    'spherical': true,
                    'distanceField': 'dist',
                    // 'maxDistance': theEarth.getRadsFromDistance(maxDistance*1000),
                    'maxDistance': maxDistance*1000,
                    'num': 10
                }
            }],
            function(err, results) {
                if (err) {
                    console.log('geoNear error:', err);
                    sendJsonResponse(res, 404, err);
                } 
                else {
                    events = buildEventList(req, res, results);
                    console.log("Test the distance:" + events.distance);
                    sendJsonResponse(res, 200, events);
                }
            }
        )
    };
};

//display events from db
var buildEventList = function(req, res, results) {
  console.log('buildEventList:');
  var events = [];
  results.forEach(function(doc) {
    events.push({
        distance: doc.dist,
        title: doc.title,
        date: doc.date,
        time: doc.time,
        event: doc.event,
        coords: doc.coords,
        category: doc.category,
        description: doc.description,
        _id: doc._id
    });
  });
  return events;
};

//add new event
module.exports.eventsCreate = function(req, res) {
    console.log("what is the db");
    console.log(req.body.coords.split(" "));
        var listDocuments=[
        {
            title: req.body.title,
            date: new Date(req.body.date),
            time: req.body.time,
            location: req.body.location,
            coords: req.body.coords.split(" "),
            category: req.body.category,
            description: req.body.description
        }
        ];
        Ut.create(listDocuments, function(err, event) {
                var thisEvent;
                if (err) {
                    console.log(err);
                    sendJsonResponse(res, 400, err);
                } else {
                    thisEvent = event[event.length - 1];
                    sendJsonResponse(res, 201, thisEvent);
                }
        });
};

// module.exports.eventsUpdateOne = function(req, res) {
//     if (!req.params.eventid) {
//         sendJsonResponse(res, 404, {
//             "message": "Not found, eventid is required"
//         });
//         return;
//     }
//     Ut
//     .findById(req.params.eventid)
//     .select('-comments')
//     .exec(
//     function(err, event) {
//         if (!event) {
//             sendJsonResponse(res, 404, {
//                 "message": "eventid not found"
//             });
//             return;
//         } 
//         else if (err) {
//             sendJsonResponse(res, 400, err);
//             return;
//         }
//         event.title = req.body.title;
//         event.date = req.body.date;
//         event.time = req.body.time;
//         event.event = req.body.event;
//         event.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
//         event.category = req.body.category;
//         event.description = req.body.description;
//         event.save(function(err, event) {
//             if (err) {
//                 sendJsonResponse(res, 404, err);
//             } 
//             else {
//                 sendJsonResponse(res, 200, event);
//             }
//         });
//     });
// };