import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_POSTS } from "../../constants/data";


export default function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_POSTS}/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }

        };
        if (id) {
            fetchPost();
        }
    }, [id])

    const goToPosts = () => {
        navigate('/');
    }

    return (
        <div className="sm:py-10 lg:py-20 container mx-auto text-white min-h-lvh">
            <p className="underline hover:cursor-pointer" onClick={goToPosts}>Back</p>
            <div className="max-w-3xl mx-auto mb-10 rounded overflow-hidden flex flex-col text-center">
                <h1 href="#" className="max-w-3xl pt-5 text-xl sm:text-4xl font-semibold inline-block transition duration-500 ease-in-out inline-block mb-2">{post.title}</h1>
                <img className="my-4" src={post.thumbnail ? post.thumbnail : "/images/sample.png"} alt="Blog visualization" />
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="mt-3 rounded-b lg:rounded-b-none lg:rounded-r flex flex-col leading-normal">
                    <div className="">
                        <p className="text-base leading-8 my-5">{post.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}