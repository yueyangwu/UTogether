var mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({
author: {type: String, required: true},
commentText: {type: String, required: true},
createdOn: {type: Date, default: Date.now}
});
var eventSchema = new mongoose.Schema({
title: {type: String, required: true},
date: {type: Date, default: Date.now, required: true},
time: {type: String, required: true},
// joined: {type: Number, "default": 0, min: 0},
// limit: {type: Number, "default": 0, min: 0},
location: {type: String, required: true},
coords: {type: [Number], index: '2dsphere'},
category: {type: String, required: true},
description: {type: String, required: true},
// img: {data: Buffer, contentType: String},
comments:[commentsSchema]
});

mongoose.model('Event',eventSchema);