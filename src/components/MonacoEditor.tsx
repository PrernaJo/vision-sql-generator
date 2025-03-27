
import React, { useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: "light" | "vs-dark";
  height?: string;
  className?: string;
  readOnly?: boolean;
  onExecute?: () => void;
}

const MonacoEditor = ({
  value,
  onChange,
  language = "sql",
  theme = "light",
  height = "400px",
  className,
  readOnly = false,
  onExecute,
}: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: "on",
      renderLineHighlight: "all",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      padding: { top: 16 }
    });
  };

  const handleCopyToClipboard = () => {
    if (editorRef.current) {
      const text = editorRef.current.getValue();
      navigator.clipboard.writeText(text).then(() => {
        toast.success("SQL copied to clipboard");
      });
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const text = editorRef.current.getValue();
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-sql.sql";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("SQL file downloaded");
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute();
    }
  };

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <div className="relative rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={onChange ? (value) => onChange(value || "") : undefined}
          theme={theme === "light" ? "vs" : "vs-dark"}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            automaticLayout: true,
          }}
          className="z-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {onExecute && (
          <Button 
            onClick={handleExecute}
            className="gap-2 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-1px]"
          >
            <Play className="h-4 w-4" />
            Execute SQL
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleCopyToClipboard}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default MonacoEditor;
