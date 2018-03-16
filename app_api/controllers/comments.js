var mongoose = require('mongoose');
var Ut = mongoose.model('Event');
var db = require('../models/db');

var request = require('request');
var apiOptions = {
server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
apiOptions.server = "https://polar-river-81614.herokuapp.com/";
}

var sendJsonResponse = function(res, status, content) {
res.status(status);
res.json(content);
};

module.exports.commentsCreate = function(req, res) {
var eventid = req.params.eventid;
if (eventid) {
Ut
.findById(eventid)
.select('comments')
.exec(
function(err, event) {
if (err) {
sendJsonResponse(res, 400, err);
} else {
doAddComment(req, res, event);
}
}
);
} else {
sendJsonResponse(res, 404, {
"message": "Not found, eventid required"
});
}
};

module.exports.commentsReadOne = function(req, res) {
if (req.params && req.params.eventid && req.params.commentid) {
Ut
.findById(req.params.eventid)
.select('title comments')
.exec(
function(err, event) {
var response, comment;
if (!event) {
sendJsonResponse(res, 404, {
"message": "eventid not found"
});
return;
} else if (err) {
sendJsonResponse(res, 400, err);
return;
}
if (event.comments && event.comments.length > 0) {
comment = event.comments.id(req.params.commentid);
if (!comment) {
sendJsonResponse(res, 404, {
"message": "commentid not found"
});
} else {
response = {
event : {
title : event.title,
id : req.params.eventid
},
comment : comment
};
sendJsonResponse(res, 200, response);
}
} else {
sendJsonResponse(res, 404, {
"message": "No comments found"
});
}
}
);
} else {
sendJsonResponse(res, 404, {
"message": "Not found, eventid and commentid are both required"
});
}
};

module.exports.commentsUpdateOne = function(req, res) {
if (!req.params.eventid || !req.params.commentid) {
sendJsonResponse(res, 404, {
"message": "Not found, eventid and commentid are both required"
});
return;
}
Ut
.findById(req.params.eventid)
.select('comments')
.exec(
function(err, event) {
var thiscomment;
if (!event) {
sendJsonResponse(res, 404, {
"message": "eventid not found"
});
return;
} else if (err) {
sendJsonResponse(res, 400, err);
return;
}
if (event.comments && event.comments.length > 0) {
thiscomment = event.comments.id(req.params.commentid);
if (!thiscomment) {
sendJsonResponse(res, 404, {
"message": "commentid not found"
});
} else {
thiscomment.author = req.body.author;
thiscomment.rating = req.body.rating;
thiscomment.commentText = req.body.commentText;
event.save(function(err, event) {
if (err) {
sendJsonResponse(res, 404, err);
} else {
updateAverageRating(event._id);
sendJsonResponse(res, 200, thiscomment);
}
});
}
} else {
sendJsonResponse(res, 404, {
"message": "No comment to update"
});
}
}
);
};

module.exports.commentsDeleteOne = function(req, res) {
if (!req.params.eventid || !req.params.commentid) {
sendJsonResponse(res, 404, {
"message": "Not found, eventid and commentid are both required"
});
return;
}
Ut
.findById(req.params.eventid)
.select('comments')
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
if (event.comments && event.comments.length > 0) {
if (!event.comments.id(req.params.commentid)) {
sendJsonResponse(res, 404, {
"message": "commentid not found"
});
} else {
event.comments.id(req.params.commentid).remove();
event.save(function(err) {
if (err) {
sendJsonResponse(res, 404, err);
} else {
updateAverageRating(event._id);
sendJsonResponse(res, 204, null);
}
});
}
} else {
sendJsonResponse(res, 404, {
"message": "No comment to delete"
});
}
}
);
};

// module.exports = Event;