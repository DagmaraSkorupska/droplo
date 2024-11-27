import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { NavigationItem } from "@/types/navigation";
import { Move, AlertCircle } from "lucide-react";
import { NavigationForm } from "./NavigationForm";

interface Props {
  item: NavigationItem;
  onEdit: (
    item: NavigationItem,
    updatedData: Partial<NavigationItem>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddChild: (
    parentId: string,
    childItem: Partial<NavigationItem>
  ) => Promise<void>;
  depth?: number;
}

export const SortableItem = ({
  item,
  onEdit,
  onDelete,
  onAddChild,
  depth = 0,
}: Props) => {
  const [showChildForm, setShowChildForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isLoading,
  });

  const getIndentation = (level: number) => {
    if (level === 0) return 24;
    return level * 64;
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${getIndentation(depth)}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddChild = async (data: Partial<NavigationItem>) => {
    try {
      setIsLoading(true);
      setError(null);
      await onAddChild(item.id, data);
      setShowChildForm(false);
    } catch {
      setError("Nie udało się dodać nowej pozycji menu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: Partial<NavigationItem>) => {
    try {
      setIsLoading(true);
      setError(null);
      await onEdit(item, data);
      setIsEditing(false);
    } catch {
      setError("Nie udało się zapisać zmian");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onDelete(item.id);
    } catch {
      setError("Nie udało się usunąć pozycji menu");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center border-b border-[#EAECF0] rounded-t-lg last:border-b-0 ${
          depth > 0 ? "bg-[#F9FAFB]" : "bg-white"
        } ${isDragging ? "cursor-grabbing" : ""}`}
      >
        <div className="flex flex-row py-[10px] w-full justify-between bg-white border-b-1 border-l-1 border-[#EAECF0] rounded-bl-lg">
          <div className="flex flex-1 min-w-0  items-center pl-4">
            <div
              {...attributes}
              {...listeners}
              className={`cursor-grab p-2.5 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Przeciągnij, aby zmienić kolejność"
            >
              <Move className="w-[16.67px] h-[16.67px] text-[#475467]" />
            </div>
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex flex-col items-start gap-1 min-w-0">
                <span className="text-sm font-semibold text-[#101828]">
                  {item.label}
                </span>
                {item.url && (
                  <span className="text-xs text-[#475467]">{item.url}</span>
                )}
              </div>
            </div>
          </div>
          <div className="inline-flex rounded-lg border border-gray-300 mr-4 bg-white shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-semibold text-[#344054] hover:bg-gray-50 focus:outline-none focus:z-10 first:rounded-l-lg border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Usuwanie..." : "Usuń"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-[#344054] hover:bg-gray-50 focus:outline-none focus:z-10 border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edytuj
            </button>
            <button
              onClick={() => setShowChildForm(true)}
              className="px-4 py-2 text-sm font-semibold text-[#344054] hover:bg-gray-50 focus:outline-none focus:z-10 last:rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dodaj pozycję menu
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 p-4 flex items-center gap-2 text-red-700 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {isEditing && (
        <div
          className="border-b border-gray-100 px-5 py-6 bg-[#F9FAFB]"
          style={{ paddingLeft: `${getIndentation(depth) + 24}px` }}
        >
          <NavigationForm
            item={item}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            onDelete={() => onDelete(item.id)}
            isInline={true}
          />
        </div>
      )}

      {showChildForm && (
        <div
          style={{ paddingLeft: `${getIndentation(depth + 1)}px` }}
          className="border-b border-gray-100 px-5 py-6 bg-[#F9FAFB]"
        >
          <NavigationForm
            onSubmit={handleAddChild}
            onCancel={() => setShowChildForm(false)}
            isInline={true}
            isFirst={true}
          />
        </div>
      )}

      {item.children?.map((child) => (
        <SortableItem
          key={child.id}
          item={child}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          depth={depth + 1}
        />
      ))}
    </>
  );
};
