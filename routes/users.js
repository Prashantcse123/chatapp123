var express = require('express');
var router = express.Router();
var passport=require('passport')
var userCtrl=require('../controller/userAuthCtrl')
var authMiddleware=require('../middleware/verifyToken')
var jwt=require('jsonwebtoken')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/google',function(req,res){
  passport.authenticate('googleToken',{session:false})
})
router.get('/login',authMiddleware.loggedIn,function(req,res){
  res.render('index')
})

router.get('/signup',authMiddleware.loggedIn,function(req,res){
  res.render('signup')
})
router.post('/login',userCtrl.signin)
router.post('/signup',userCtrl.signup)
router.get('/logout',userCtrl.logout)
router.get('/profile',authMiddleware.verify,(req,res)=>{
  var token=req.cookies.AuthCookie;
  console.log(token)
  var decode=jwt.verify(token,"systango@#$secret123",(err,user)=>{
    if(err){
      console.log(err)
    }
    else{
       console.log(user)
       res.render('profile',{username:user.name})
    }
  })
 
})


module.exports = router;
