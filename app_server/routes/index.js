var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');
var ctrlOthers = require('../controllers/others');

/* Events pages */
router.get('/events', ctrlEvents.eventsList);
router.get('/events/:eventid', ctrlEvents.eventInfo);
router.get('/mynewevent/new', ctrlEvents.addEvent);
router.post('/mynewevent/new', ctrlEvents.doAddEvent);
router.get('/events/:eventid/comment/new', ctrlEvents.addComment);
router.post('/events/:eventid/comment/new', ctrlEvents.doAddComment);
// router.get('/event/myevent', ctrlEvents.myEvent);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router; 
