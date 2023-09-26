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
describe("PostsList component image_url rendering", () => {
    const mockPostWithImageUrl = [
        {
            id: 1,
            title: "Post with Image",
            body: "Hello Image",
            image_url: "https://via.placeholder.com/150",
        },
    ];

    const mockPostWithoutImageUrl = [
        {
            id: 2,
            title: "Post without Image",
            body: "Hello Placeholder",
            image_url: null,
        },
    ];

    test("renders the image with image_url exists", async() => {
        postsService.fetchAllPosts.mockResolvedValue(mockPostWithImageUrl);

        render(<PostsList />, { wrapper: MemoryRouter });

        await waitFor(() => screen.getByText(mockPostWithImageUrl[0].title));

        const imgElement = screen.getByAltText(mockPostWithImageUrl[0].title);
        expect(imgElement).toBeInTheDocument();
        expect(imgElement.src).toBe(mockPostWithImageUrl[0].image_url);
    });

    test("renders the placeholder div when image_url does not exist", async () => {
        postsService.fetchAllPosts.mockResolvedValue(mockPostWithoutImageUrl);

        render(<PostsList />, { wrapper: MemoryRouter });

        await waitFor(() => screen.getByText(mockPostWithoutImageUrl[0].title));

        const placeholderDiv = screen.getByTestId("post-image-stub");
        expect(placeholderDiv).toBeInTheDocument();
    });
});
