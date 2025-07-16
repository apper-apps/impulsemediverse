import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden";
  const hoverStyles = hover ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1" : "";
  const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";

  if (hover) {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          baseStyles,
          gradientStyles,
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        gradientStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;