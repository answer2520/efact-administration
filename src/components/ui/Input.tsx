import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#172B4D]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-10 rounded-lg border px-3 text-sm text-[#172B4D] outline-none transition-colors placeholder:text-[#6B778C] focus:border-[#2684FF] focus:ring-2 focus:ring-[#2684FF]/30 ${
            error ? "border-red-500" : "border-[#D2DCE8]"
          } ${className ?? ""}`}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
