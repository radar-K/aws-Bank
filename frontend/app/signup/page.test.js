import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "./page";

describe("Home", () => {
  it("renders a heading", () => {
    render(<SignUp />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
