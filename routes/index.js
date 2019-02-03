var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"msg": "welcome to Diane, a lightweight blogging api written in node.js"});
});

module.exports = router;
