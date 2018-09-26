var express = require('express');
var router = express.Router();
  router.get('/chatRoom',(req,res)=>{
    var username=req.query.username||"Anonymous";
    res.render('chatRoom',{username:username})
  })
  router.post('/chatRoom',(req,res)=>{
    var username=req.body.username||"Anonymous";
    res.render('chatRoom',{username:username})
  })
  module.exports = router;
  