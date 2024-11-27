"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NavigationItem } from "@/types/navigation";
import { SortableItem } from "./SortableItem";
import { NavigationForm } from "./NavigationForm";
import { v4 as uuidv4 } from "uuid";
import { CirclePlus } from "lucide-react";

const NavigationManager = () => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findItemAndParent = (
    items: NavigationItem[],
    id: string,
    parent: NavigationItem | null = null
  ): [NavigationItem | null, NavigationItem | null] => {
    for (const item of items) {
      if (item.id === id) {
        return [item, parent];
      }
      if (item.children?.length) {
        const [found, foundParent] = findItemAndParent(item.children, id, item);
        if (found) {
          return [found, foundParent];
        }
      }
    }
    return [null, null];
  };

  const removeItem = (
    items: NavigationItem[],
    id: string
  ): NavigationItem[] => {
    return items.filter((item) => {
      if (item.id === id) {
        return false;
      }
      if (item.children?.length) {
        item.children = removeItem(item.children, id);
      }
      return true;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((items) => {
      const [activeItem, activeParent] = findItemAndParent(
        items,
        active.id as string
      );
      const [, overParent] = findItemAndParent(items, over.id as string);

      if (!activeItem) return items;

      let newItems = [...items];

      if (activeParent) {
        activeParent.children = activeParent.children?.filter(
          (child) => child.id !== active.id
        );
      } else {
        newItems = removeItem(newItems, active.id as string);
      }

      if (overParent) {
        const parentChildren = overParent.children || [];
        const overIndex = parentChildren.findIndex(
          (child) => child.id === over.id
        );
        parentChildren.splice(overIndex, 0, activeItem);
      } else {
        const overIndex = newItems.findIndex((item) => item.id === over.id);
        newItems.splice(overIndex, 0, activeItem);
      }

      return newItems;
    });
  };

  const handleAddItem = (data: Partial<NavigationItem>) => {
    const newItem: NavigationItem = {
      id: uuidv4(),
      label: data.label!,
      url: data.url,
      children: [],
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setShowAddForm(false);
  };

  const handleEditItem = async (
    item: NavigationItem,
    updatedData: Partial<NavigationItem>
  ): Promise<void> => {
    setItems((prevItems) => {
      const updateItemInTree = (items: NavigationItem[]): NavigationItem[] => {
        return items.map((currentItem) => {
          if (currentItem.id === item.id) {
            return {
              ...currentItem,
              ...updatedData,
            };
          }
          if (currentItem.children?.length) {
            return {
              ...currentItem,
              children: updateItemInTree(currentItem.children),
            };
          }
          return currentItem;
        });
      };

      return updateItemInTree(prevItems);
    });
  };

  const handleAddChild = (
    parentId: string,
    childData: Partial<NavigationItem>
  ): Promise<void> => {
    return new Promise((resolve) => {
      const newChild: NavigationItem = {
        id: uuidv4(),
        label: childData.label!,
        url: childData.url,
        children: [],
      };

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newChild],
            };
          }

          if (item.children?.length) {
            return {
              ...item,
              children: updateChildren(item.children, parentId, newChild),
            };
          }
          return item;
        })
      );
      resolve();
    });
  };

  const updateChildren = (
    children: NavigationItem[],
    parentId: string,
    newChild: NavigationItem
  ): NavigationItem[] => {
    return children.map((child) => {
      if (child.id === parentId) {
        return {
          ...child,
          children: [...(child.children || []), newChild],
        };
      }
      if (child.children?.length) {
        return {
          ...child,
          children: updateChildren(child.children, parentId, newChild),
        };
      }
      return child;
    });
  };

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    setItems((prevItems) => {
      const removeFromItems = (items: NavigationItem[]): NavigationItem[] => {
        return items.reduce((acc: NavigationItem[], item) => {
          if (item.id === itemId) {
            return acc;
          }

          const newItem = {
            ...item,
            children: item.children ? removeFromItems(item.children) : [],
          };

          return [...acc, newItem];
        }, []);
      };

      return removeFromItems(prevItems);
    });
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  return (
    <div className="max-w-[1208px] mx-auto py-8 px-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {(items.length > 0 || (items.length === 0 && !showAddForm)) && (
            <div className="bg-white rounded-lg border border-[#D0D5DD]">
              {items.length === 0 && !showAddForm ? (
                <div className="flex flex-col gap-4 px-4 py-6 items-center bg-[#F9FAFB] rounded-lg border-[#EAECF0]">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900 leading-6">
                      Menu jest puste
                    </p>
                    <p className="text-sm text-[#475467] leading-5">
                      W tym menu nie ma jeszcze żadnych linków.
                    </p>
                  </div>
                  <button
                    onClick={handleAddClick}
                    className="flex flex-row bg-[#7F56D9] py-2.5 px-3.5 text-white rounded-lg gap-1 text-sm items-center font-semibold"
                  >
                    <CirclePlus className="w-5 h-5" /> Dodaj pozycję menu
                  </button>
                </div>
              ) : (
                <>
                  {items.length > 0 && (
                    <SortableContext
                      items={items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div>
                        {items.map((item) => (
                          <SortableItem
                            key={item.id}
                            item={item}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            onAddChild={handleAddChild}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                  {showAddForm && items.length > 0 && (
                    <div>
                      <div className="p-5 bg-[#F9FAFB]">
                        <NavigationForm
                          onSubmit={(data) => {
                            handleAddItem(data);
                            setShowAddForm(false);
                          }}
                          onCancel={() => setShowAddForm(false)}
                          isInline={true}
                          isFirst={true}
                        />
                      </div>
                      <div className="bg-[#F9FAFB] p-5 border-t border-[#D0D5DD] rounded-b-lg">
                        <button
                          onClick={handleAddClick}
                          className="bg-white py-2.5 px-3.5 text-[#344054] font-semibold rounded-lg gap-1 text-sm items-center font-semibold border border-[#D0D5DD] hover:bg-gray-50 focus:outline-none focus:z-10 shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]"
                        >
                          Dodaj pozycję menu
                        </button>
                      </div>
                    </div>
                  )}
                  {!showAddForm && items.length > 0 && (
                    <div className="bg-[#F9FAFB] p-5 border-t border-[#D0D5DD] rounded-b-lg">
                      <button
                        onClick={handleAddClick}
                        className="bg-white py-2.5 px-3.5 text-[#344054] font-semibold rounded-lg gap-1 text-sm items-center font-semibold border border-[#D0D5DD] hover:bg-gray-50 focus:outline-none focus:z-10 shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]"
                      >
                        Dodaj pozycję menu
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {items.length === 0 && showAddForm && (
            <NavigationForm
              onSubmit={(data) => {
                handleAddItem(data);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
              isInline={false}
              isFirst={true}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default NavigationManager;
