var express = require('express');
var router = express.Router();
var passport =require('passport')
var authMiddleware=require('../middleware/verifyToken')
/* GET home page. */
router.get('/',authMiddleware.loggedIn,function(req, res, next) {
  res.render('index');
});

module.exports = router;
