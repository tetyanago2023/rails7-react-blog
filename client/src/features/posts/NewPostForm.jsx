import React from 'react';
import {useNavigate} from "react-router-dom";
import {createPost} from "../../services/postService.js";
import PostForm from "./PostForm.jsx";
import {objectToFormData} from "../../utils/formDataHelper.js";

function NewPostForm() {
    const navigate = useNavigate();

    const handleCreateSubmit = async (rawData) => {
        try {
            const formData = objectToFormData({ post: rawData });
            const response = await createPost(formData);
            navigate(`/posts/${response.id}`);
        } catch (e) {
            console.error("Failed to create post: ", e);
        }
    };

    return (
        <PostForm
            buttonText={"Create Post"}
            headerText={"Create a New Post"}
            onSubmit={handleCreateSubmit}
        />
    );
}

export default NewPostForm;