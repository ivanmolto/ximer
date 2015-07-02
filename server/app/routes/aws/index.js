'use strict';
var router = require('express').Router();
module.exports = router;

var _ = require('lodash');
var body = require('body-parser');
var mongoose = require('mongoose');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var s3 = new AWS.S3();
var fs = require('fs');
var path = require('path');
var bucketName = 'fullstacktracks';

var Project = mongoose.model('Project');


router.post('/', function (req, res, next) {

	var tracks = req.body.tracks;
	var projectId = req.body.projectId;

	var urlTracks = [];
	

	tracks.forEach(function (track) {
		
		// base64 data prepends header, spliting the header
		var slicedTrack = track.rawAudio.split(',');
		var trackBuffer = new Buffer(slicedTrack[1],'base64'); // the blob

		//the uuid generates a unique string of characters each time
		var keyName = uuid.v4() + '.wav';
		var url = 'https://s3-us-west-2.amazonaws.com/fullstacktracks/' + keyName;
		urlTracks.push(url)
		var params = {Bucket: bucketName, Key: keyName, Body: trackBuffer};

		s3.putObject(params, function(err, data) {
			if (err)
			 console.log(err)
			else
			 console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
		});
	})

	Project.findById(projectId).exec().then(function (project) {

		tracks.forEach(function (track, i) {
			var newTrack = {};
			newTrack.name = track.name;
			newTrack.url = urlTracks[i];
			newTrack.locations = track.locations;
			project.tracks.push(newTrack);
		});

		return project.save();
		 
	}, next)
    .then(function() {
    	res.send('great success!');
    });



});
