import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostsList from "./PostsList.jsx";
import * as postsService from "../../services/postService";

jest.mock("../../constants", () => ({
    API_URL: "http://your-test-api-url",
}));

global.console.error = jest.fn();
jest.mock("../../services/postService", () => ({
    fetchAllPosts: jest.fn(),
    deletePost: jest.fn(),
}));

describe("PostList component", () => {

    const mockPosts = [
        {id: 1, title: "Post 1", body: "Hi!"},
        {id: 2, title: "Post 2", body: "Hi again!"},
    ];
    beforeEach(() => {
        postsService.fetchAllPosts.mockResolvedValue(mockPosts);
        postsService.deletePost.mockResolvedValue();
    });

    test("render list of posts", async () => {
        render(<PostsList />, {wrapper: MemoryRouter});

        await waitFor(() => screen.findByText("Post 1"));

        expect(screen.getByText("Post 1")).toBeInTheDocument();
        expect(screen.getByText("Post 2")).toBeInTheDocument();
    });

    test("deletes the post when delete button is clicked", async () => {
        render(<PostsList />, {wrapper: MemoryRouter});

        const postText = "Post 1"
        await waitFor(() => screen.findByText(postText));

        fireEvent.click(screen.getAllByText("Delete")[0]);

        await waitFor(() => expect(postsService.deletePost).toHaveBeenCalled());
        expect(screen.queryByText(postText)).not.toBeInTheDocument();
    });

    test("sets error and loading to false when fetching posts fails", async () => {
        const error = new Error("An error occurred!");
        // "Failed to fetch posts:", e => An error occurred!
        postsService.fetchAllPosts.mockRejectedValue(error);

        render(<PostsList />, { wrapper: MemoryRouter });
        await waitFor(() => {
            // TODO: spy on the console instead of mocking it
            expect(console.error).toHaveBeenCalledWith(
                "Failed to fetch posts: ",
                error
            );
        });
    });

    test("logs error when deleting a post fails", async () => {
        postsService.fetchAllPosts.mockResolvedValue(mockPosts);
        const deleteError = new Error("Delete failed!");
        postsService.deletePost.mockRejectedValue(deleteError);

        render(<PostsList />, { wrapper: MemoryRouter });

        await waitFor(() => screen.getByText("Post 1"));

        fireEvent.click(screen.getAllByText("Delete")[0]);
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "Failed to delete the post: ",
                deleteError
            );
        });
    });
});
