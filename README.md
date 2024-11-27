# Navigation Manager

## Overview

Navigation Manager is a modern, interactive React component for managing navigation menu structure. It enables creating, editing, and organizing multi-level menus through an intuitive drag & drop interface.

## Features

- ✨ Create and edit menu items
- 🔄 Drag & drop for structure reorganization
- 📱 Fully responsive interface
- 🌳 Nested submenu support
- 🎨 Modern design following UI/UX best practices
- ♿ Accessibility (ARIA attributes)
- 🔍 Form validation
- 🚨 Comprehensive error handling

## Technologies

- React 18
- TypeScript
- @dnd-kit (drag & drop library)
- react-hook-form (form management)
- TailwindCSS (styling)
- UUID (unique identifier generation)

## Installation & Setup

```bash
# Install dependencies
npm install

# Development
npm run dev        # Start development server
npm run build      # Create production build
npm run start      # Start production server
npm run lint       # Run linter
npm run test       # Run tests in watch mode
npm run test:ci    # Run tests in CI mode
```

## Project Structure

```
src/
  components/
    NavigationManager/
      NavigationManager.tsx    # Main management component
      NavigationForm.tsx       # Add/edit form component
      SortableItem.tsx        # Single menu item component
  types/
    navigation.ts             # TypeScript types
```

## Usage

```tsx
import { NavigationManager } from "./components/NavigationManager";

function App() {
  return (
    <div>
      <h1>Menu Management Panel</h1>
      <NavigationManager />
    </div>
  );
}
```

## Data Structure

Each menu item is represented by the following structure:

```typescript
interface NavigationItem {
  id: string;
  label: string;
  url?: string;
  children?: NavigationItem[];
}
```

## Functions

- **Add Items**: Create new menu elements
- **Edit**: Modify existing items
- **Delete**: Remove single items or entire submenus
- **Drag & Drop**: Reorganize menu structure through dragging
- **Nesting**: Create submenus at any level
- **Validation**: Input data verification
- **Error Handling**: Comprehensive exception handling

## Error Handling

The component includes extensive error handling:

- Form validation (required fields, URL format)
- Drag & drop operation error handling
- Protection against invalid data
- User-friendly error messages

## Accessibility

### Keyboard Controls

- **Navigation Between Elements**

  - `Tab` - move between interactive elements (buttons, form fields)
  - `Shift + Tab` - move backwards between elements

- **Drag & Drop Operations**

  - `Space` / `Enter` - start dragging an element
  - `Arrow Keys (↑↓)` - move element up/down
  - `Space` / `Enter` - drop element in new position
  - `Esc` - cancel drag operation

- **Item Editing**

  - `Enter` on "Edit" button - open edit form
  - `Tab` - navigate between form fields
  - `Enter` in form - confirm changes
  - `Esc` - close form without saving

- **Submenu Management**

  - `Enter` on "Add Menu Item" - open new item form
  - `Delete` / `Backspace` on "Delete" button - remove menu item

- **Forms**
  - `Tab` - move between fields
  - `Enter` - submit form
  - `Esc` - close form

### ARIA Attributes for Screen Readers

The component implements proper ARIA attributes ensuring screen reader compatibility.

### Color Contrast

All interface elements meet WCAG 2.1 contrast requirements.

### Clear Error Messages

Error messages are designed to be clear and informative for all users.

## Author

Dagmara Skorupska
