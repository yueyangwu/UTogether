/* GET 'home' page */
module.exports.eventsList = function(req, res){
res.render('eventslist', { 
    title: 'Event List',
    events: [{
        title: 'Pumpkin Carving Night',
        date: '10/23/2017',
        time: '17:30',
        joined: '18 joined',
        distance: '100m'
    },
    {
        title: 'Introduction to Authentic Chinese Food',
        date: '10/13/2017',
        time: '13:10',
        joined: '29 joined',
        distance: '200m'
    },
    {
        title: 'International Faculty & Scholars Social Hour',
        date: '10/9/2017',
        time: '10:00',
        joined: '10 joined',
        distance: '250m'
    }]
 });
};
/* GET 'Event info' page */
module.exports.eventInfo = function(req, res){
res.render('eventinfo', { title: 'Location Info' });
};
/* GET 'Add event' page */
module.exports.addEvent = function(req, res){
res.render('addevent', { title: 'Add Event' });
};
module.exports.myEvent = function(req, res){
res.render('index', { title: 'My Events' });
};
