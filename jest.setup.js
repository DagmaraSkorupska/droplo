import "@testing-library/jest-dom";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
  SortableContext: ({ children }) => children,
  verticalListSortingStrategy: jest.fn(),
}));

jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }) => children,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(),
}));
