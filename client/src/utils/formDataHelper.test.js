import { objectToFormData, formDataToObject } from "./formDataHelper";

describe("objectToFormData", () => {
    test("should convert a simple object to FormData", () => {
        const expected_object = {
            title: "Hi all!",
            body: "This is a test"
        };
        const actual_object = objectToFormData(expected_object);

        expect(actual_object.get("title")).toEqual(expected_object.title);
        expect(actual_object.get("body")).toEqual(expected_object.body);
    });

    test("should handle nested objects", () => {
        const expected_object = {
            post: {
                title: "Hi all!",
                body: "This is a test"
            },
        };

        const actual_object = objectToFormData(expected_object);

        expect(actual_object.get("post[title]")).toEqual(
            expected_object.post.title
        );
        expect(actual_object.get("post[body]")).toEqual(expected_object.post.body);
    });

    test("should handle Date objects", () => {
        const expected_object = {
            post: {
                title: "Hello World",
                body: "This is a test",
                created_at: new Date("2020-01-01"),
            },
        };
        const actual_object = objectToFormData(expected_object);

        expect(actual_object.get("post[created_at]")).toEqual(
            expected_object.post.created_at.toISOString()
        );
    });

    test("should handle File objects", () => {
        const file = new File(["content"], "filename.txt");
        const expected_object = {
            post: {
                title: "Hello World",
                body: "This is a test",
                file: file,
            },
        };
        const actual_object = objectToFormData(expected_object);

        expect(actual_object.get("post[title]")).toEqual(
            expected_object.post.title
        );
        expect(actual_object.get("post[body]")).toEqual(expected_object.post.body);
        expect(actual_object.get("post[file]")).toEqual(expected_object.post.file);
    });
});

describe("formDataToObject", () => {

    test("should convert FormData to an Object", () => {
        const formData = new FormData();
        formData.append("a", "1");
        formData.append("b", "2");

        const result = formDataToObject(formData);

        expect(result).toEqual({a: "1", b: "2"});
    });
});