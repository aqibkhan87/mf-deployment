import React from "react";
import { BrowserRouter } from "react-router-dom";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/login";

const mockFunction = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => mockFunction,
}));

test("Testing Login Form Component", () => {
  render(<Login />);
  const doc = screen.getByText(/Username or email address/i);
  expect(doc).toBeInTheDocument();
});

test("Testing Login Form Component Email Field", () => {
  render(<Login />);
  const inputField = screen.getByRole("textbox");
  expect(inputField).toHaveAttribute("name", "Email Address or UserName");
});

test("Testing Login Form Component Email Field", () => {
  render(<Login />);
  const inputField = screen.getByRole("textbox");
  expect(inputField.name).toEqual("Email Address or UserName");
});

describe("Component Input Field Testing", () => {
  test("Email Field Testing", () => {
    render(<Login />);
    const inputField = screen.getByRole("textbox");
    expect(inputField.value).toBe("");
    fireEvent.change(inputField, { target: { value: "ABCD" } });
    expect(inputField.value).toBe("ABCD");
  });

  test("Form Submission", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const inputField = screen.getByRole("textbox");
    const passwordField = screen.getByPlaceholderText("Enter Password");
    const signInBtn = screen.getByRole("button", { name: "Sign in" });
    expect(inputField.value).toBe("");
    expect(passwordField.value).toBe("");
    fireEvent.change(inputField, { target: { value: "aqib@gmail.com" } });
    fireEvent.change(passwordField, { target: { value: "123456" } });
    expect(inputField.value).toBe("aqib@gmail.com");
    fireEvent.click(signInBtn);

    waitFor(() => {
      expect(mockFunction).toHaveBeenCalledWith("/");
    });
  });
});
