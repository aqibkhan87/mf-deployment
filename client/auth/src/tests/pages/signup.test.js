import React from "react";
import { render, screen } from "@testing-library/react";
import SignUp from "../../components/signup";

test("signup component", () => {
  render(<SignUp />);
  const title = screen.getByText(/Create your free account/i);
  expect(title).toBeInTheDocument();
});
