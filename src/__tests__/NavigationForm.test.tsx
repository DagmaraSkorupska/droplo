import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationForm } from "../components/navigation/NavigationForm";

describe("NavigationForm", () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render empty form correctly", () => {
    render(<NavigationForm {...mockProps} />);

    expect(screen.getByLabelText("Nazwa")).toHaveValue("");
    expect(screen.getByLabelText("Link")).toHaveValue("");
  });

  it("should show validation error when submitted without name", async () => {
    render(<NavigationForm {...mockProps} />);

    await userEvent.click(screen.getByRole("button", { name: /dodaj/i }));
    expect(screen.getByText("Nazwa jest wymagana")).toBeInTheDocument();
  });

  it("should call onSubmit with form data when submitted", async () => {
    render(<NavigationForm {...mockProps} />);

    await userEvent.type(screen.getByLabelText("Nazwa"), "Test Item");
    await userEvent.type(screen.getByLabelText("Link"), "https://test.com");
    await userEvent.click(screen.getByRole("button", { name: /dodaj/i }));

    expect(mockProps.onSubmit).toHaveBeenCalledWith({
      label: "Test Item",
      url: "https://test.com",
    });
  });

  it("should call onCancel when cancel button is clicked", async () => {
    render(<NavigationForm {...mockProps} />);

    await userEvent.click(screen.getByRole("button", { name: /anuluj/i }));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it("should show delete button when item prop is provided", () => {
    render(
      <NavigationForm
        {...mockProps}
        item={{ id: "1", label: "Test", url: "https://test.com" }}
      />
    );

    expect(screen.getByRole("button", { name: /usuń/i })).toBeInTheDocument();
  });

  it("should apply different styles based on isInline prop", () => {
    const { container: inlineContainer } = render(
      <NavigationForm {...mockProps} isInline={true} />
    );
    const { container: standardContainer } = render(
      <NavigationForm {...mockProps} isInline={false} />
    );

    expect(inlineContainer.firstChild).toHaveClass("bg-[#F9FAFB]");
    expect(standardContainer.firstChild).not.toHaveClass("bg-[#F9FAFB]");
  });
});
