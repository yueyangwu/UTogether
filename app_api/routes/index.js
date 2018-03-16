var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');
var ctrlComments = require('../controllers/comments');

// events
router.get('/events', ctrlEvents.eventsListByDistance);
router.post('/events', ctrlEvents.eventsCreate);
router.get('/events/:eventid', ctrlEvents.eventsReadOne);
router.put('/events/:eventid', ctrlEvents.eventsUpdateOne);
router.delete('/events/:eventid', ctrlEvents.eventsDeleteOne);
//comment

router.post('/events/:eventid/comments', ctrlComments.commentsCreate);
router.get('/events/:eventid/comments/:commentid', ctrlComments.commentsReadOne);
router.put('/events/:eventid/comments/:commentid', ctrlComments.commentsUpdateOne);
router.delete('/events/:eventid/comments/:commentid', ctrlComments.commentsDeleteOne);

module.exports = router;