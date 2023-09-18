//standard
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
// custom stuff we made
import NewPostForm from "./NewPostForm.jsx";
import { createPost } from "../../services/postService";

jest.mock("../../services/postService", () => ({
    // we need to return id, title, body
    createPost: jest.fn(() => {
        return {
            id: 1,
            title: "Test Post",
            body: "This is a test post.",
        };
    }),
}));

describe("NewPostForm", () => {
    const renderForm = () => {
        render(
            <Router>
                <NewPostForm />
            </Router>
        );
    }


    afterEach(() => {
        jest.clearAllMocks();
    });

    test("render NewPostForm and allow typing", () => {
        renderForm();

        const titleInput = screen.getByLabelText(/Title:/i);
        const bodyInput = screen.getByLabelText(/Body:/i);
        const submitButton = screen.getByRole("button", { name: /create post/i });



        const expectedTitle = "Test Post";
        const expectedBody = "This is a test post.";

        fireEvent.change(titleInput, { target: { value: expectedTitle } });
        fireEvent.change(bodyInput, {
            target: { value: expectedBody },
        });

        expect(titleInput.value).toBe(expectedTitle);
        expect(bodyInput.value).toBe(expectedBody);
        expect(submitButton).toBeInTheDocument();
    });

    test("submits form and redirect to post page", async () => {
        renderForm();

        const titleInput = screen.getByLabelText(/Title:/i);
        const bodyInput = screen.getByLabelText(/Body:/i);
        const submitButton = screen.getByRole("button", { name: /create post/i });

        fireEvent.change(titleInput, { target: { value: "Test Post" } });
        fireEvent.change(bodyInput, {
            target: { value: "This is a test post." },
        });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(createPost).toHaveBeenCalledTimes(1);
    });

    test("displays error message when post creation fails", async () => {
        createPost.mockRejectedValue(new Error("Failed to create post."));

        const consoleSpy = jest.spyOn(console, "error");
        consoleSpy.mockImplementation(jest.fn());

        renderForm();

        const titleInput = screen.getByLabelText(/Title:/i);
        const bodyInput = screen.getByLabelText(/Body:/i);
        const submitButton = screen.getByRole("button", { name: /create post/i });

        fireEvent.change(titleInput, { target: { value: "Test Post" } });
        fireEvent.change(bodyInput, {
            target: { value: "This is a test post." },
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to create post: ",
            new Error("Failed to create post.")
        );
    });
});


