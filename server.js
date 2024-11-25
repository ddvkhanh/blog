require('dotenv').config(); 

const { v4: uuidv4 } = require('uuid'); 
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;
const API_POSTS = "/api/posts";
const API_POST_WITH_ID = API_POSTS + "/:id"


const corsOptions = {
    origin: process.env.CORS_ORIGIN, //frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.json());

// let posts = [
//   {
//     id: 1,
//     title: "Exploring the Basics of HTML",
//     content:
//       "HTML, or HyperText Markup Language, is the standard language for creating web pages. It describes the structure of a web page and its contents, such as headings, paragraphs, links, images, and other elements. Learning HTML is the first step towards web development, and it provides the foundation for creating web pages and web applications.",
//   },
//   {
//     id: 2,
//     title: "Getting Started with CSS",
//     content:
//       "CSS, or Cascading Style Sheets, is a style sheet language used to describe the presentation of a document written in HTML. CSS controls the layout, colors, fonts, and overall visual appearance of a web page. By using CSS, you can create visually appealing web pages and ensure a consistent look and feel across your site. Understanding CSS is essential for front-end development and helps bring your HTML content to life.",
//   },
// ];

//Connect MongoDB
console.log('Connecting to MongoDB with the following URI:', process.env.DB_CONNECTION_STRING);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_CONNECTION_STRING, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected...'))
  .catch(error => console.error(error));

//Define schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  thumbnail: {
    data: Buffer,
    contentType: String,
  }
})

const Post = mongoose.model("Post", postSchema);

//set up multer middleware for img upload
const path = require('path'); 
const multer =require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {fileSize: 10*1024*1024}
  })

app.get(API_POSTS, async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Convert the image binary data (Buffer) to Base64 for each post
    const updatedPosts = posts.map(post => {
      const postObj = post.toObject(); // Convert the Mongoose document to a plain object

      if (postObj.thumbnail && postObj.thumbnail.data) {
        const base64Image = postObj.thumbnail.data.toString('base64'); 
        const contentType = postObj.thumbnail.contentType;
        postObj.thumbnail = `data:${contentType};base64,${base64Image}`; 
      } else {
        postObj.thumbnail = '/images/sample.png';
      }

      return postObj;
    });

    res.json(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


//Get 1 post
app.get(API_POST_WITH_ID, async (req, res) => {
  try {
    const {id} = req.params;
    const foundPost = await Post.findById(id);
      if (foundPost) {
        if (foundPost.thumbnail && foundPost.thumbnail.data) {
          const base64Image = foundPost.thumbnail.data.toString('base64');
          const contentType = foundPost.thumbnail.contentType;
          res.json({
            ...foundPost.toObject(),
            thumbnail: `data:${contentType};base64,${base64Image}`,
          });
        } else {
          res.json({
            ...foundPost.toObject(),
            thumbnail: "/images/sample.png", 
        });
      }
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({error: "Failed to fetch post"});
  }
});

// Add a new blog
app.post(API_POSTS,upload.single('thumbnail') , async (req, res) => {
  try {
    const newPost = new Post({
    title:req.body.title, 
    content: req.body.content,
    thumbnail: req.file ? {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      fileName: `Thumbnail-photo-${uuidv4()}`
    }
    : {
      data:null,
      contentType:'image/png',
      defaultImagePath:'/images/sample.png'
    }
  })
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Failed to save post" });
  }
});

// Edit a blog
app.put(API_POST_WITH_ID, upload.single('thumbnail'), async(req, res) => {
  try {
    const { id } = req.params;
    const updatedPostData = {
        title: req.body.title,
        content: req.body.content,
    };
    if (req.file) {
      updatedPost.thumbnail = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: `Thumbnail-photo-${uuidv4()}`
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(id, updatedPostData, {new: true});
    res.status(201).json(updatedPost);

  } catch(error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }

});

// Delete a blog
app.delete(API_POST_WITH_ID, async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});


//PORT
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
