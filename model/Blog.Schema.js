const mongoose= require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Title  is mandatory"]
    },
    body : {
      type: String,
      required: [true, "No blog exists without a body."]
    }
  });

module.exports = Blog = new mongoose.model("blogs",blogSchema);
