import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortableItem } from "../components/navigation/SortableItem";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
  }),
}));

describe("SortableItem", () => {
  const mockItem = {
    id: "1",
    label: "Test Item",
    url: "https://test.com",
    children: [],
  };

  const mockProps = {
    item: mockItem,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onAddChild: jest.fn(),
    depth: 0,
  };

  it("should render item with correct content", () => {
    render(<SortableItem {...mockProps} />);

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("https://test.com")).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", async () => {
    render(<SortableItem {...mockProps} />);

    await userEvent.click(screen.getByRole("button", { name: /edytuj/i }));
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockItem);
  });

  it("should call onDelete when delete button is clicked", async () => {
    render(<SortableItem {...mockProps} />);

    await userEvent.click(screen.getByRole("button", { name: /usuń/i }));
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockItem.id);
  });

  it("should show child form when add child button is clicked", async () => {
    render(<SortableItem {...mockProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /dodaj pozycję menu/i })
    );
    expect(screen.getByLabelText("Nazwa")).toBeInTheDocument();
  });

  it("should apply correct indentation based on depth", () => {
    const { container } = render(<SortableItem {...mockProps} depth={1} />);
    const itemElement = container.firstChild;

    expect(itemElement).toHaveStyle({ paddingLeft: "64px" });
  });
});
