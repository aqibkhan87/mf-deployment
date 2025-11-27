import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import MainNav from "../components/mainNav";

jest.mock("store/cartStore");
jest.mock("store/authStore");

test("Testing Dashboard MainNav Component", () => {
  render(
    <BrowserRouter>
      <MainNav />
    </BrowserRouter>
  );
  const textVerification = screen.getByText("Metacook");
  expect(textVerification).toBeInTheDocument();
});
