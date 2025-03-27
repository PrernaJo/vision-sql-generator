
import React from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, ArrowRight } from "lucide-react";

export type Step = {
  id: string;
  label: string;
  description: string;
};

interface ProcessingStepsProps {
  steps: Step[];
  currentStepIndex: number;
  className?: string;
}

const ProcessingSteps = ({ 
  steps, 
  currentStepIndex, 
  className 
}: ProcessingStepsProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex items-start gap-3 transition-all duration-300",
                isCompleted ? "opacity-70" : "opacity-100",
              )}
            >
              <div className="flex-shrink-0 mt-1">
                <div 
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isCurrent 
                        ? "border-2 border-primary text-primary" 
                        : "border-2 border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <h3 
                  className={cn(
                    "font-medium leading-none mb-1",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </h3>
                <p 
                  className={cn(
                    "text-sm text-muted-foreground",
                    isCurrent && "animate-pulse-soft"
                  )}
                >
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="ml-3 my-2 border-l-2 border-muted h-4 border-dashed" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingSteps;
