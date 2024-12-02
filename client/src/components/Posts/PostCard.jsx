import { useNavigate, Outlet } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { API_POSTS } from '../../constants/data';
import axios from 'axios';

export default function PostCard({ post, deletePost }) {
    const { title, content, thumbnail, _id } = post;

    const navigate = useNavigate();

    const goToPostDetails = () => {
        navigate(`/${_id}`);
    }

    const goToEditPost = () => {
        navigate(`/edit/${_id}`);
    }

    const handleDeletePost = async () => {
        if (window.confirm("Do you want to delete this post?")) {
            try {
                await axios.delete(`${API_POSTS}/${_id}`);
                alert("Post deleted successfully.");
                deletePost(_id);
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete the post. Please try again.");
            }
        } else {
            return;
        }
    }

    return (
        <div className="flex flex-col w-full lg:h-64 bg-gray-700 overflow-hidden rounded-lg lg:flex-row lg:items-start">
            <div className="w-full lg:w-2/6 h-ful">
                <img className="object-cover lg:h-64  w-full overflow-hidden" src={thumbnail ? thumbnail : "/images/sample.png"} alt="Thumbnail" />
            </div>
            <div className="w-full lg:w-4/6 p-5 min-h-60">
                <div className="relative">
                    {/* <div className="pb-5">
                        <p className="text-white opacity-50 text-xs">May 18</p>
                        <h2 className="text-white mb-1">Kathy Dang</h2>
                    </div> */}
                    <div className="flex justify-end gap-5 mb-3">
                        <button
                            type="button"
                            onClick={goToEditPost}
                            className="bg-white inline-flex items-center justify-center rounded-md p-2.5 text-black hover:bg-teal-700"
                        >
                            <PencilSquareIcon className="h-7 w-7" />
                        </button>
                        <button
                            type="button"
                            className="bg-white inline-flex items-center justify-center rounded-md p-2.5 text-black hover:bg-teal-700"
                            onClick={handleDeletePost}
                        >
                            <TrashIcon className="h-7 w-7" />
                        </button>
                    </div>
                </div>
                <h2 className="text-white leading-normal text-lg">{title}</h2>
                <p className="text-gray-300 mt-2 line-clamp-3 h-30" dangerouslySetInnerHTML={{ __html: content }}></p>
                {/* <div  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img src="https://randomuser.me/api/portraits/men/11.jpg" />
                        </div> */}
                <button className="float-right bottom-3.5 pt-3 underline" onClick={goToPostDetails}>Read More</button>
                <Outlet />
            </div>
        </div>
    )
}