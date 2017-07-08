var express = require('express');
var router = express.Router();
var ctrlEvents = require('../controllers/events');
var ctrlOthers = require('../controllers/others');

/* Events pages */
router.get('/', ctrlEvents.eventsList);
router.get('/event', ctrlEvents.eventInfo);
router.get('/event/new', ctrlEvents.addEvent);
router.get('/event/myevent', ctrlEvents.myEvent);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
