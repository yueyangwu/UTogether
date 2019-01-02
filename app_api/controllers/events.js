var mongoose = require('mongoose');
var Ut = mongoose.model('Event');

var sendJsonResponse = function(res, status, content) {
res.sendStatus(status);
res.json(content);
};

module.exports.eventsDeleteOne = function(req, res) {
var eventid = req.params.eventid;
if (eventid) {
Ut
.findByIdAndRemove(eventid)
.exec(
function(err, event) {
if (err) {
sendJsonResponse(res, 404, err);
return;
}
sendJsonResponse(res, 204, null);
}
);
} else {
sendJsonResponse(res, 404, {
"message": "No eventid"
});
}
};

module.exports.eventsReadOne = function(req, res) {
if (req.params && req.params.eventid && req.params.id) {
Ut
.findById(req.params.eventid)
.exec(function(err, event) {
if (!event) {
sendJsonResponse(res, 404, {
"message": "eventid not found"
});
return;
} else if (err) {
sendJsonResponse(res, 404, err);
return;
}
sendJsonResponse(res, 200, event);
});
} else {
sendJsonResponse(res, 404, {
"message": "No eventid in request"
});
}
};

var theEarth = (function(){
var earthRadius = 6371; // km, miles is 3959
var getDistanceFromRads = function(rads) {
return parseFloat(rads * earthRadius);
};
var getRadsFromDistance = function(distance) {
return parseFloat(distance / earthRadius);
};
return {
getDistanceFromRads : getDistanceFromRads,
getRadsFromDistance : getRadsFromDistance
};
})();

module.exports.eventsListByDistance = function(req, res) {
var lng = parseFloat(req.query.lng);
var lat = parseFloat(req.query.lat);
var point = {
type: "Point",
coordinates: [lng, lat]
};
var geoOptions = {
spherical: true,
maxDistance: theEarth.getRadsFromDistance(20),
num: 10
};
if (!lng || !lat) {
sendJsonResponse(res, 404, {
"message": "lng and lat query parameters are required"
});
return;
}
Ut.geoNear(point, options, function (err, results, stats) {
var events = [];
if (err) {
sendJsonResponse(res, 404, err);
} else {
results.forEach(function(doc) {
events.push({
distance: theEarth.getDistanceFromRads(doc.dis),
title: doc.obj.title,
date: doc.obj.date,
time: doc.obj.time,
joined: doc.obj.joined,
address: doc.obj.address,
_id: doc.obj._id
});
});
sendJsonResponse(res, 200, events);
}
});
};

module.exports.eventsCreate = function(req, res) {
Ut.create({
title: req.body.title,
date: req.body.date,
time: req.body.time,
joined: req.body.joined,
limit: req.body.limit,
address: req.body.address,
category: req.body.category,
description: req.body.description,
image: req.body.image,
comments: req.body.comments,
coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
}, function(err, location) {
if (err) {
sendJsonResponse(res, 400, err);
} else {
sendJsonResponse(res, 201, location);
}
});
};

module.exports.eventsUpdateOne = function(req, res) {
if (!req.params.eventid) {
sendJsonResponse(res, 404, {
"message": "Not found, locationid is required"
});
return;
}
Ut
.findById(req.params.eventid)
.select('-comments -joined')
.exec(
function(err, event) {
if (!event) {
sendJsonResponse(res, 404, {
"message": "eventid not found"
});
return;
} else if (err) {
sendJsonResponse(res, 400, err);
return;
}
event.title = req.body.title;
event.address = req.body.address;
event.date = req.body.date,
event.time = req.body.time,
event.limit = req.body.limit,
event.address = req.body.address,
event.category = req.body.category,
event.description = req.body.description,
event.image = req.body.image,
event.coords = [parseFloat(req.body.lng),
parseFloat(req.body.lat)];
event.save(function(err, event) {
if (err) {
sendJsonResponse(res, 404, err);
} else {
sendJsonResponse(res, 200, event);
}
});
}
);
};

// module.exports = Event;