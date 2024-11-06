import React from "react";
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import PostList from "./components/Posts/PostList";
import PostDetails from "./components/Posts/PostDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About/About";
import BlogForm from "./components/Form/BlogForm";
import Contact from "./components/Contact/Contact";
import { API_POSTS_PATH } from "./constants/data";


function App() {
  return (
    <div className="bg-black mx-auto text-white">
      <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<PostList />} />
              <Route path="/:id" element={<PostDetails />}/>
              <Route path="/new" element={<BlogForm />}/>
              <Route path="/edit/:id" element={<BlogForm />} /> {/* Edit Post */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
