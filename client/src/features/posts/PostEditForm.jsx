import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {fetchPost, updatePost} from "../../services/postService.js";

function PostEditForm() {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [, setLoading] = useState(true);
    const [, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        //Fetch current post by id
        const fetchCurrentPost = async () => {
            try {
                const json = await fetchPost(id);
                setPost(json)
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPost = {
            title: post.title,
            body: post.body
        };

        try {
            const response = await updatePost(id, updatedPost);
            navigate(`/posts/${response.id}`);
        } catch (e) {
            console.error("Failed to update the post: ", e);
        }
    };

    if (!post) return <h2>Loading...</h2>

    return (
        <div>
            <h2>Edit Post</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="post-title">Title</label>
                    <br />
                    <input
                        id="post-title"
                        type="text"
                        value={post.title}
                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="post-body">Body</label>
                    <br />
                    <textarea
                        id="post-body"
                        value={post.body}
                        onChange={(e) => setPost({ ...post, body: e.target.value })}
                    />
                </div>
                <div>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}

export default PostEditForm;