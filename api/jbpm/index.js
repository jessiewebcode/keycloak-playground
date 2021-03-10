var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send({
    todo: 'use jBPM REST'
  });
});

module.exports = {
  router
};
