const mongoose= require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema= new mongoose.Schema({
    name:{
   type:String,
required:true
    },
    rollno:{
        type:Number,
        unique:true,

    },
    email_id:{
   type:String,
   required:true,
   unique:true
    },
    password:{
       required:true,
       type:String 
    }


})



userSchema.pre('save',async function(next){
if(this.isModified('password')){
   this.password=await bcrypt.hash(this.password,10);
}
next();
})



///generating webtoken
userSchema.methods.createjwttoken = async function(username){
    
  return jwt.sign(username,process.env.TOKEN_SECRET,{expiresIn:'1800s'}); 
}
 

module.exports = users = new mongoose.model("users",userSchema);