import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavigationManager from "../components/navigation/NavigationManager";
import "@testing-library/jest-dom";

describe("NavigationManager", () => {
  it("should show empty state initially", () => {
    render(<NavigationManager />);

    expect(screen.getByText("Menu jest puste")).toBeInTheDocument();
    expect(
      screen.getByText("W tym menu nie ma jeszcze żadnych linków.")
    ).toBeInTheDocument();
  });

  it("should show form when add button is clicked", async () => {
    render(<NavigationManager />);

    const addButton = screen.getByRole("button", {
      name: /dodaj pozycję menu/i,
    });
    await userEvent.click(addButton);

    expect(screen.getByLabelText("Nazwa")).toBeInTheDocument();
    expect(screen.getByLabelText("Link")).toBeInTheDocument();
  });

  it("should add new item when form is submitted", async () => {
    render(<NavigationManager />);

    await userEvent.click(
      screen.getByRole("button", { name: /dodaj pozycję menu/i })
    );

    await userEvent.type(screen.getByLabelText("Nazwa"), "Test Item");
    await userEvent.type(screen.getByLabelText("Link"), "https://test.com");

    await userEvent.click(screen.getByRole("button", { name: /dodaj/i }));

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("https://test.com")).toBeInTheDocument();
  });

  it("should allow editing existing item", async () => {
    render(<NavigationManager />);

    await userEvent.click(
      screen.getByRole("button", { name: /dodaj pozycję menu/i })
    );
    await userEvent.type(screen.getByLabelText("Nazwa"), "Original Name");
    await userEvent.click(screen.getByRole("button", { name: /dodaj/i }));

    await userEvent.click(screen.getByRole("button", { name: /edytuj/i }));

    const nameInput = screen.getByLabelText("Nazwa");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Name");

    await userEvent.click(screen.getByRole("button", { name: /zapisz/i }));

    expect(screen.getByText("Updated Name")).toBeInTheDocument();
  });

  it("should delete item when delete button is clicked", async () => {
    render(<NavigationManager />);

    await userEvent.click(
      screen.getByRole("button", { name: /dodaj pozycję menu/i })
    );
    await userEvent.type(screen.getByLabelText("Nazwa"), "To Delete");
    await userEvent.click(screen.getByRole("button", { name: /dodaj/i }));

    await userEvent.click(screen.getByRole("button", { name: /usuń/i }));

    expect(screen.queryByText("To Delete")).not.toBeInTheDocument();
  });
});
