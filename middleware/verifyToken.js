let app=require('express')
let router=app.Router();
var jwt=require('jsonwebtoken')
module.exports.verify=function(req,res,next){
   var token=req.cookies.AuthCookie;
   console.log(token)
   if(token === undefined){
    res.redirect('/users/login')
  }
   var decoded = jwt.verify(token, 'systango@#$secret123',function(err, decoded) {
     if(err){
       res.redirect('/users/login')
     }
     else{
        console.log(decoded)
        next();
     }
  });

}
module.exports.loggedIn=function(req,res,next){
  console.log("I am here....")
  var token=req.cookies.AuthCookie;
  console.log(token)
  var decoded = jwt.verify(token, 'systango@#$secret123',function(err, decoded) {
    if(err){
      next()
    }
    else{
       console.log(decoded)
       res.redirect('/users/profile')
    }
 });

}