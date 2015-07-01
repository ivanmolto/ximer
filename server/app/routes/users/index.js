'use strict';
var router = require('express').Router();
module.exports = router;
var userModel = require('mongoose').model('User');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/:id', ensureAuthenticated, function (req, res) {
    userModel.find(req.query).exec().then(function(data){
        res.send(data);
    }, function(err){
        res.status(500).send(err.message);
    });
});

router.post('/', function(req, res){
    var user = req.body;
    userModel.create(user).then(function(createdProduct){
        res.send(createdProduct);
    }, function(err){
        res.status(500).send(err.message);
    });
});

router.put('/:id', function(req, res){
    userModel.update({_id: req.params.id}, req.body);
});

router.delete(':id', function(req, res){
    userModel.remove({_id: req.params.id}, function(err){
        if(err) res.status(500).send(err);
        res.send('Success!');
    });
});