var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');

// events
router.get('/events', ctrlEvents.eventsListByDate);
router.post('/events', ctrlEvents.eventsCreate);
router.get('/events/:eventid', ctrlEvents.eventsReadOne);
router.put('/events/:eventid', ctrlEvents.eventsUpdateOne);
router.delete('/events/:eventid', ctrlEvents.eventsDeleteOne);

module.exports = router;