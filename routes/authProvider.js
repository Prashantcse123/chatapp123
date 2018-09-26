var express = require('express');
var router = express.Router();
var passport =require('passport')

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.render('profile',{"username":req.user.displayName})
    
})
router.get('/facebook',passport.authenticate('facebook',{ scope : ['email'] }));
 
router.get('/facebook/redirect',passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/' }),
  function(req, res) {
    res.render('profile',{"username":req.user.displayName})
  });


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.sendStatus(401);
}


module.exports=router;