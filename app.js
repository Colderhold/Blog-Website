//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my personal blog! Here, I share my daily experiences, coding adventures, and everything that inspires me. Whether I’m deep into solving a technical issue or taking a break to explore new hobbies, this blog is a space where I reflect on what I learn every day. Stay tuned for posts on web development, new tech discoveries, and my journey in continuous growth. Feel free to browse through my posts and join me as I document my progress!";
const aboutContent = "Hi, I’m Dhruv Shetty, a passionate coder and lifelong learner. This blog is a reflection of my journey in tech, where I share insights from the projects I’m working on, challenges I face, and breakthroughs I achieve. When I’m not writing code, I enjoy exploring new tools and technologies, reading about the latest trends in development, and constantly improving my skills. Through this blog, I hope to inspire others, share my experiences, and create a space where knowledge and creativity can flourish.";
const contactContent = "I'd love to hear from you! Whether you have questions about my posts, ideas to share, or just want to chat about all things tech, feel free to reach out. You can contact me via email at [your-email@example.com] or connect with me on social media platforms. Let's collaborate, exchange ideas, and grow together in this ever-evolving world of technology!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
