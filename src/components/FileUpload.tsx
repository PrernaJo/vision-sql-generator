
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

const FileUpload = ({
  onFileSelected,
  className,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      {!preview ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out",
            "flex flex-col items-center justify-center gap-4 text-center",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-1">Upload UI Screenshot</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Drag and drop an image, or click to browse
            </p>
            
            <Button 
              onClick={handleButtonClick}
              variant="outline"
              className="group transition-all duration-300"
            >
              <ImageIcon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Select Image
            </Button>
          </div>
          
          {error && (
            <p className="text-destructive text-sm mt-2 animate-fade-in">{error}</p>
          )}
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden group animate-fade-in">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full object-contain max-h-[400px] rounded-xl" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              variant="destructive" 
              size="icon"
              className="h-10 w-10 rounded-full transition-transform hover:scale-110"
              onClick={handleRemoveFile}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
