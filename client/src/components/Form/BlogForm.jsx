import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_POSTS } from '../../constants/data';
import RichTextEditor from './RichTextEditor';

export default function BlogForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailName, setThumbnailName] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();
    const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB


    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`${API_POSTS}/${id}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setThumbnail(response.data.thumbnail);
                } catch (error) {
                    console.error('Error fetching post:', error);

                }
            };
            fetchPost();
        }
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > FILE_SIZE_LIMIT) {
                alert("File size exceeds 10MB limit. Please choose a smaller file.");
                e.target.value = "";
                setThumbnail(null);
                setThumbnailName(null);
            } else {
                setThumbnail(file);
                setThumbnailName(file.name);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            if (id) {
                // update existing post
                const response = await axios.put(`${API_POSTS}/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Post updated:', response.data);
                alert("Post updated successfully");
            } else {
                // create new post
                const response = await axios.post(API_POSTS, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log('Post created:', response.data);
                alert("Post created successfully");
            }

        } catch (error) {
            console.error('Error saving post:', error);
            alert("Error saving post. Please try again.");
        }


    }

    const handleCancel = () => {
        navigate("/");
    }

    return (
        <div className="sm:py-10 lg:py-20 container mx-auto">
            <div className="max-w-3xl mx-auto mb-10 rounded overflow-hidden flex flex-col text-center">
                <h1 className="max-w-3xl pt-5 text-xl sm:text-4xl font-semibold inline-block transition duration-500 ease-in-out inline-block mb-2">{id ? 'Edit Post' : 'Add New Post'}</h1>
            </div>
            <div className="bg-white p-12 rounded-lg">

                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">Title</label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6" placeholder="Title of your blog" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label>Content:</label>
                                    <label className="block text-sm/6 font-medium text-gray-900">Content</label>
                                    <div className="mt-2">
                                        <RichTextEditor content={content} setContent={setContent} />
                                        {/* <textarea id="content" name="content" rows="10" value={content} onChange={(e) => setContent(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" required></textarea> */}
                                    </div>
                                    <p className="mt-3 text-sm/6 text-gray-600">Write the content for your blog.</p>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="file-upload" className="block text-sm/6 font-medium text-gray-900">Thumbnail photo</label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                            </svg>
                                            <div className="mt-4 flex text-sm/6 text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            {thumbnailName && <p className="mt-2 text-gray-800">Selected file: {thumbnailName}</p>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={handleCancel}>Cancel</button>
                        <button type="button" className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600" onClick={handleSubmit}>{id ? 'Update Post' : 'Add Post'}</button>
                    </div>
                </form>
            </div>
        </div>

    )
}