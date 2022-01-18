const express= require("express");
var bodyParser = require('body-parser');
const bcrypt=require("bcrypt");
const mongoose= require("mongoose");
const users = require("../model/User.Schema");
const html = require("html");
const ejs = require("ejs");

function validateEmail(email_id){
   var regex=/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9/-]+)(.[a-z]{2,20})(.[a-z]{2-8})?$/;
   return regex.test(email_id);
}
const app = express();
// app.set('view-engine','html');

var path = require("path")
app.use(express.static("public"));


const router= express.Router();
// app.use(express.static("public"));

router.get("/login", function(req, res){
   res.sendFile(path.resolve('./views/login.html'));
 });
 router.get("/register", function(req, res){
   res.sendFile(path.resolve('./views/register.html'));
 });
//registration part//
router.post('/register',async(req,res)=>{
    const{name,rollno,email_id,password}=req.body;
    console.log(req.body);
    if(!name||!rollno||!email_id||!password){
       return res.status(401).json({error:"enter all the four details properly"});
    }
    if(email_id.length<=4 && validateEmail(email_id)){
      return res.status(402).json({error:"plz check the length of email id entered"});
    }

    else{ 
       try{
        const data =await users.findOne({rollno:rollno});
        if(data){
          return  res.status(401).json({error:"you are registered already"});         
        }
        const user =new users({name,rollno,email_id,password});
        await user.save();
        console.log(req.body);
      //   return res.status(201).json({message:"user has been registered sucessfully"});
      res.redirect("/");


    }
    catch(err){
    console.log(err);
    res.status(402).json({error:"user has not been registered"}); 
    }}
   
})

//////login code///////////////
router.post('/login',async(req,res)=>{
    try{
        const{email_id,password}=req.body;
      // console.log(req.body);

        if(!email_id||!password){
           return res.status(400).json({error:"please fill the email and password correctly"}); 
        }  
        var data= await users.findOne({email_id:email_id});
        if(data){
           const check=bcrypt.compare(password,data.password);
           if(check){
          
            
            //   return res.status(402).json({message:"user logen in sucessfully"}); 
            // res.render(path.resolve('./views/home.ejs'),{posts: blog});
            res.redirect("/");

           }
           else{
             return res.status(200).json({error:"please check the  details again"})
           };
        }
    }
   catch(err){
     console.log(err) 
   }
  
})

module.exports=router;


