import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {fetchPost, updatePost} from "../../services/postService.js";
import PostForm from "./PostForm.jsx";

function PostEditForm() {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        //Fetch current post by id
        const fetchCurrentPost = async () => {
            try {
                const json = await fetchPost(id);
                setPost(json)
            } catch (e) {
                console.error("Failed to fetch the post: ", e);
            }
        };
        fetchCurrentPost();
    }, [id]);

    const handleUpdateSubmit = async (formData) => {
        try {
            const response = await updatePost(id, formData);
            navigate(`/posts/${id}`);
        } catch (e) {
            console.error("Failed to update the post: ", e);
        }
    };

    if (!post) return <h2>Loading...</h2>

    return (
       <PostForm
           post={post}
           buttonText={"Update Post"}
           headerText={"Edit Post"}
           onSubmit={handleUpdateSubmit}
       />
    );
}

export default PostEditForm;