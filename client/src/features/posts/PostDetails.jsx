import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {API_URL} from "../../constants.js";
import {deletePost, fetchPost} from "../../services/postService.js";

function PostDetails() {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentPost = async () => {
            try {
                const json = await fetchPost(id);
                setPost(json);
            } catch (error) {
                console.error("Failed to fetch the post: ", error);
            }
        };
        fetchCurrentPost();
    }, [id]);

    const deletePostHandler = async () => {
        try {
           await deletePost(post.id);
           navigate("/");
        } catch (error) {
            console.error("Failed to delete the post: ",error);
        }
    }

    if(!post) return <h2>Loading...</h2>;

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <Link to={`/posts/${id}/edit`}>Edit Post</Link>
            {" | "}
            <Link to="/">Back to Posts</Link>
            {" | "}
            <button onClick={deletePostHandler} >Delete</button>
        </div>
    )
}

export default PostDetails;