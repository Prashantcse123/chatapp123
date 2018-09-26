var mongoose=require('mongoose')
var bcrypt=require('bcrypt')

var userSchema=mongoose.Schema;

let user= new userSchema({
  name:String,
  username:{type: String,required:true,index:true},
  email:String,
  password:String,
  gender:{type:String,default:'male'},
  phone:Number,
  accountCreatedDate:{type:Date,default:Date()}
})

var User=module.exports=mongoose.model("UserCollection",user)

module.exports.getHash=function(passsword){
  return bcrypt.hashSync(passsword,10)
}
module.exports.comparePassword=function(passsword,hash){
  return bcrypt.compareSync(passsword,hash)
}
