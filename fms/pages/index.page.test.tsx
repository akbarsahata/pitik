import { render, screen } from "@testing-library/react";
import metadata from "../package.json";
import Home from "./index.page";

describe("Homepage", () => {
  it("render the title", () => {
    render(<Home />);

    const title = screen.getByTestId("title");

    expect(title).toHaveTextContent(
      `Welcome to Pitik Farm Management System v${metadata.version}!!! 🐔🐔🐔`
    );
  });
});
