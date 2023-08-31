// API_URL comes from the .env.development file
import React, {useEffect, useState} from 'react';
import { API_URL } from "../../constants.js"
import {Link} from "react-router-dom";

function PostsList() {
    const [posts, setPosts] = useState([]);
    const [, setLoading] = useState(true);
    const [, setError] = useState(null);

     //Fetch posts from API
    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const json = await response.json();
                    setPosts(json);
                } else {
                    throw response;
                }
            } catch (e) {
                setError("An error occurred. Awkward...");
                console.log("An error occurred:", e);
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id} className="post-container">
                    <h2>
                        <Link to={`/posts/${post.id}`} className="post-title">
                            {post.title}
                        </Link>
                    </h2>

                    <p>{post.body}</p>
                </div>
            ))}
        </div>
        )
}

export default PostsList;