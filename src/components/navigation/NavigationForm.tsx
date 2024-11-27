import { useForm } from "react-hook-form";
import { NavigationItem } from "@/types/navigation";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  item?: NavigationItem;
  onSubmit: (data: Partial<NavigationItem>) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  isInline?: boolean;
  isFirst?: boolean;
}

export const NavigationForm = ({
  item,
  onSubmit,
  onCancel,
  onDelete,
  isInline = false,
  isFirst = false,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setError,
  } = useForm<Partial<NavigationItem>>({
    defaultValues: item || {
      label: "",
      url: "",
    },
    mode: "onBlur",
  });

  const validateUrl = (url?: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return "Wprowadź poprawny adres URL";
    }
  };

  const onSubmitHandler = async (data: Partial<NavigationItem>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (data.label && data.label.length > 50) {
        setError("label", {
          type: "manual",
          message: "Nazwa nie może przekraczać 50 znaków",
        });
        return;
      }

      await onSubmit(data);

      if (!item) {
        reset({
          label: "",
          url: "",
        });
      }
    } catch {
      setSubmitError("Wystąpił błąd podczas zapisywania. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (item && onDelete) {
      try {
        await onDelete(item.id);
      } catch {
        setSubmitError("Wystąpił błąd podczas usuwania. Spróbuj ponownie.");
      }
    }
  };

  const formContent = (
    <div className="bg-white rounded-lg border border-[#D0D5DD] flex flex-row">
      <div className="p-4 space-y-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nazwa<span className="text-red-500">*</span>
          </label>
          <input
            {...register("label", {
              required: "Nazwa jest wymagana",
              minLength: {
                value: 2,
                message: "Nazwa musi mieć minimum 2 znaki",
              },
              maxLength: {
                value: 50,
                message: "Nazwa nie może przekraczać 50 znaków",
              },
            })}
            placeholder="np. Promocje"
            className={`w-full px-3 py-2 text-base text-[#667085] border ${
              errors.label ? "border-red-500" : "border-[#D0D5DD]"
            } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]`}
            aria-invalid={errors.label ? "true" : "false"}
          />
          {errors.label && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.label.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Link
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("url", {
                validate: validateUrl,
              })}
              type="text"
              placeholder="Wklej lub wyszukaj"
              className={`w-full pl-10 pr-3 py-2 text-base text-[#667085] border ${
                errors.url ? "border-red-500" : "border-[#D0D5DD]"
              } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]`}
              aria-invalid={errors.url ? "true" : "false"}
            />
          </div>
          {errors.url && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.url.message}
            </p>
          )}
        </div>

        {submitError && (
          <div className="text-red-500 text-sm" role="alert">
            {submitError}
          </div>
        )}

        <div className="flex justify-start gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-white py-2.5 px-3.5 text-[#344054] font-semibold rounded-lg gap-1 text-sm items-center font-semibold border border-[#D0D5DD] shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              Anuluj
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={`bg-white py-2.5 px-3.5 text-[#6941C6] font-semibold rounded-lg gap-1 text-sm items-center font-semibold border border-[#D6BBFB] shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)] ${
              isSubmitting || !isDirty ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Zapisywanie..." : item ? "Zapisz" : "Dodaj"}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={isFirst ? onCancel : handleDelete}
        className="self-start text-[#667085] hover:text-[#344054] p-6"
        disabled={isSubmitting}
      >
        <Trash2 className="w-[20px] h-[20px]" />
      </button>
    </div>
  );

  if (isInline) {
    return <form onSubmit={handleSubmit(onSubmitHandler)}>{formContent}</form>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="bg-white rounded-lg border border-[#D0D5DD]">
        {formContent}
      </div>
    </form>
  );
};

export default NavigationForm;
