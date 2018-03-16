var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');
var ctrlOthers = require('../controllers/others');

/* Events pages */
router.get('/', ctrlEvents.eventsList);
router.get('/event/:eventid', ctrlEvents.eventInfo);
router.get('/event/:eventid/new', ctrlEvents.addEvent);
router.get('/event/:eventid/comment/new', ctrlEvents.addReview);
router.post('/event/:eventid/comment/new', ctrlEvents.doAddReview);
router.get('/event/myevent', ctrlEvents.myEvent);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router; 
