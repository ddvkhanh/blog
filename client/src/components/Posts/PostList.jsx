import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import PostCard from "./PostCard"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_POSTS } from "../../constants/data";

export default function PostList() {
    const navigate = useNavigate();

    const goToNewPost = () => {
        navigate('/new');
    }

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(API_POSTS);
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchBlogs();
    }, []);

    const deletePost = (id) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

    return (
        <div className="px-5 text-white container mx-auto sm:py-10 lg:py-20">
            <button className="rounded-lg bg-teal-700 p-2 my-5 hover:bg-teal-500 inline-flex gap-1" onClick={goToNewPost}><PlusIcon className="h-6 w-6" />Add New Post</button>
            <div className="gap-10 pb-10 flex flex-col md:flex-row items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-pretty text-base font-medium">
                    {posts.map((post) => (
                        <PostCard key={post._id || post.title} post={post} deletePost={deletePost} />
                    ))}
                </div>
            </div>
        </div>
    )
}