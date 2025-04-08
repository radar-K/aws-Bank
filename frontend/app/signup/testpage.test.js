import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TestPage from "./testpage";

describe("Home", () => {
  it("renders a heading", () => {
    render(<TestPage />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
