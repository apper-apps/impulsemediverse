import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none";
  
  const errorStyles = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const iconPadding = icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={18} className="text-gray-500" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            errorStyles,
            iconPadding,
            className
          )}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={18} className="text-gray-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;