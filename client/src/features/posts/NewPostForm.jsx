import React from 'react';
import {useNavigate} from "react-router-dom";
import {createPost} from "../../services/postService.js";
import PostForm from "./PostForm.jsx";

function NewPostForm() {
    const navigate = useNavigate();

    const handleCreateSubmit = async (rawData) => {
        //let's create formData object
        const formData = new FormData();
        //can't just be a raw fields
        //needs to be wrapped in the post[field_name]
        formData.append("post[title]", rawData.title);
        formData.append("post[body]", rawData.body);
        formData.append("post[image]", rawData.image);
        try {
            // const response = await createPost(rawData);
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