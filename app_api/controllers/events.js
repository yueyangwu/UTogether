var db = require('../models/db'); //reference of db.js  
var Event = {  
    eventsListByDate: function(callback) {  
        return db.query("Select * from events", callback);  
    },  
    eventsReadOne: function(id, callback) {  
        return db.query("select * from events where id=?", [id], callback);  
    },  
    eventsCreate: function(event, callback) {  
        return db.query("Insert into events values(?,?,?,?,?,?,?,?,?,?)", [event.id, event.title, event.pic, event.start_time, event.date, event.location, event.people_limit, event.host_id, event.description, event.category], callback);  
    },  
    eventsDeleteOne: function(id, callback) {  
        return db.query("delete from events where id=?", [id], callback);  
    },  
    eventsUpdateOne: function(id, event, callback) {  
        return db.query("update events set id=?, title=?, pic=?, start_time=?, date=?, location=?, people_limit=?, host_id=?, description=?, category=? where Id=?", [event.id, event.title, event.pic, event.start_time, event.date, event.location, event.people_limit, event.host_id, event.description, event.category], callback);  
    }  
};
module.exports = Event;