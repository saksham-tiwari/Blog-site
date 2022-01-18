const express = require("express");
var bodyParser = require('body-parser');
// const mongoose=require("mongoose");
const app =express();
const ejs = require("ejs");
// const mongoose= require('mongoose');
const _ = require('lodash');
var path = require("path")

let posts=[];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// const db = "mongodb+srv://aman:atlaskicycle@cluster0.as0ic.mongodb.net/basicdata?retryWrites=true&w=majority" 
// mongoose.connect("mongodb+srv://admin-saksham:lucky121@cluster0.9c72s.mongodb.net/blogsDB2?retryWrites=true&w=majority",{
// }).then(()=>{
//    console.log('connection sucessful') 
// }).catch((err)=>{
// console.log("connection unsuccessful")
//     console.log(err)
// })

const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Blog = require("./model/Blog.Schema");
// const Blogs = schemas.Blogs;
// const userSchema= new mongoose.Schema({
//     name:{
//    type:String,
// required:true
//     },
//     rollno:{
//         type:Number,
//         unique:true,

//     },
//     email_id:{
//    type:String,
//    required:true,
//    unique:true
//     },
//     password:{
//        required:true,
//        type:String 
//     }


// })

// const blogSchema = new mongoose.Schema({
//     title: {
//       type: String,
//       required: [true, "Title  is mandatory"]
//     },
//     body : {
//       type: String,
//       required: [true, "No blog exists without a body."]
//     }
//   });

// userSchema.pre('save',async function(next){
// if(this.isModified('password')){
//    this.password=await bcrypt.hash(this.password,10);
// }
// next();
// })

// const users = new mongoose.model("users",userSchema);

// const Blog = new mongoose.model("Blog", blogSchema);



// ///generating webtoken
// userSchema.methods.createjwttoken = async function(username){
    
//   return jwt.sign(username,process.env.TOKEN_SECRET,{expiresIn:'1800s'}); 
// }

const home = new Blog({
  title: "Home",
  body: homeStartingContent
});

const defaultBlogs = [home];



app.use(express.json());
app.use(express.static("views"));
app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/partials/')]);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = process.env.PORT ||5400;

require("./conn/conn");
require('./model/User.Schema');

const middleware = (req,res,next)=>{
  console.log("middleware is there");
  next(); 
}

app.get("/", function(req,res){
  Blog.find({}, function(err, blogs){
    if(blogs.length===0){
      Blog.insertMany(defaultBlogs, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully added default blogs");
        }
      });
      res.redirect("/");
    }
    else{
      Blog.find({}, function(err, blogs){
        res.render("home.ejs", {posts: blogs});
      });
    }
  });
});

app.get("/about", function(req,res){
  res.render("about.ejs", {aboutContent: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact.ejs", {contactContent: contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose.ejs");
});

app.post("/compose", function(req, res){
  const postTitle= req.body.postTitle;
  if(postTitle==="Home"){
    res.render("error.ejs", {message:"Cannot create another blog with name Home"});
  }
  else{
    const blog = new Blog({
      title: postTitle,
      body: req.body.postBody
    });

    blog.save();
    res.redirect("/");
  }
});

app.get("/posts/:postId", function(req,res){
  const requestedPostId= req.params.postId;
  Blog.findOne({_id:requestedPostId}, function(err, blog){
    if(!err){
        res.render("post.ejs", {post: blog})
      }
      else{
        console.log(err);
      }
  });
});

app.get("/delete", function(req, res){
  res.render("delete.ejs");
});

app.post("/delete", function(req,res){
  var id= req.body.postId;
  if(id==="5fbea25f797250000459105a"){
    res.render("error.ejs", {message:"Cannot delete home blog"});
  }
  else{
    Blog.remove({_id: id}, function(err, found){
        if(err){
          console.log(err);
        }
        else{
            console.log("Successfully Removed");
            res.redirect("/");
        }
    });
  }
});

app.use(require('./router/auth'));


app.listen(port,(err)=>{
   if(err)console.log("connection has not been setup");
   else console.log(`connection is set up at ${port}`); 
});


// module.exports = users;