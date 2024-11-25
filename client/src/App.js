import React from "react";
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import PostList from "./components/Posts/PostList";
import PostDetails from "./components/Posts/PostDetails";
import { Routes, Route } from "react-router-dom";
import About from "./components/About/About";
import BlogForm from "./components/Form/BlogForm";


function App() {
  return (
    <div className="bg-black mx-auto text-white min-h-lvh">
        <NavBar />
        <Routes>
            <Route path="/" element={<PostList />} />
              <Route path="/:id" element={<PostDetails />}/>
              <Route path="/new" element={<BlogForm />}/>
              <Route path="/edit/:id" element={<BlogForm />} /> {/* Edit Post */}
            <Route path="/about" element={<About />} />
        </Routes>
    </div>
  );
}

export default App;
