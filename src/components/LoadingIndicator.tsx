
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingIndicator = ({ 
  text = "Processing...", 
  className, 
  size = "md" 
}: LoadingIndicatorProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(
        "rounded-full border-transparent border-t-primary animate-spin",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse-soft">{text}</p>
      )}
    </div>
  );
};

export default LoadingIndicator;
