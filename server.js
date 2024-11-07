require('dotenv').config(); 

const { v4: uuidv4 } = require('uuid'); 
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

let posts = [
  {
    id: 1,
    title: "Exploring the Basics of HTML",
    content:
      "HTML, or HyperText Markup Language, is the standard language for creating web pages. It describes the structure of a web page and its contents, such as headings, paragraphs, links, images, and other elements. Learning HTML is the first step towards web development, and it provides the foundation for creating web pages and web applications.",
  },
  {
    id: 2,
    title: "Getting Started with CSS",
    content:
      "CSS, or Cascading Style Sheets, is a style sheet language used to describe the presentation of a document written in HTML. CSS controls the layout, colors, fonts, and overall visual appearance of a web page. By using CSS, you can create visually appealing web pages and ensure a consistent look and feel across your site. Understanding CSS is essential for front-end development and helps bring your HTML content to life.",
  },
];

// Get the list of blogs
app.get(API_POSTS, (req, res) => {
  console.log(posts)
  res.json(posts);
});

//Get 1 post
app.get(API_POST_WITH_ID, (req, res) => {
  const {id} = req.params;
  const foundPost = posts.find(post => post.id === Number(id));
    console.log(foundPost)

  if (foundPost) {
        res.json(foundPost); // Return the found post
  } else {
        res.status(404).json({ message: "Post not found" }); // Return a 404 if not found
  }
});

//set up multer middleware for img upload
const path = require('path'); 
const multer =require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'client/public/images/blogs');

    cb(null, uploadPath);
  },
   filename: (req,file, cb) => {
    const uniqueName= `ThumbnailPhoto-${uuidv4()}.${file.mimetype.split('/')[1]}`;
    cb(null, uniqueName);
   }
})
const upload = multer({storage: storage})

// Add a new blog
app.post(API_POSTS,upload.single('thumbnail') , (req, res) => {
      console.log(req.body); // Log the body
    console.log(req.file); 
  const newPost = { 
    id: uuidv4(), 
    title:req.body.title, 
    content: req.body.content,
    thumbnail: req.file ? `/images/blogs/${req.file.filename}` : null 
   };
  posts.push(newPost);
  res.json(newPost);
});

// Edit a blog
app.put(API_POST_WITH_ID, upload.single('thumbnail'), (req, res) => {
  const { id } = req.params;
  const updatedPost = {
        id: Number(id),
        title: req.body.title,
        content: req.body.content,
        thumbnail: req.file ? `/images/blogs/${req.file.filename}` : null
    };
  posts = posts.map((post) => (post.id === Number(id) ? updatedPost : post));
  res.json(updatedPost);
});

// Delete a blog
app.delete(API_POST_WITH_ID, (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post) => post.id !== Number(id));
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
