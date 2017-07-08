/* GET 'home' page */
module.exports.eventsList = function(req, res){
res.render('eventslist', { title: 'Home' });
};
/* GET 'Event info' page */
module.exports.eventInfo = function(req, res){
res.render('eventinfo', { title: 'Location info' });
};
/* GET 'Add event' page */
module.exports.addEvent = function(req, res){
res.render('addevent', { title: 'Add event' });
};
module.exports.myEvent = function(req, res){
res.render('index', { title: 'My events' });
};
