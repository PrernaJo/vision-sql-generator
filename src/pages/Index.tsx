
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Database, 
  ImageIcon, 
  Code, 
  Cpu, 
  ArrowRight, 
  Terminal
} from "lucide-react";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import MonacoEditor from "@/components/MonacoEditor";
import LoadingIndicator from "@/components/LoadingIndicator";
import ProcessingSteps, { Step } from "@/components/ProcessingSteps";
import { 
  analyzeUIScreenshot, 
  generateSqlFromAnalysis, 
  executeSql,
  VisionAnalysisResult,
  SqlGenerationResult
} from "@/utils/apiService";

const processingSteps: Step[] = [
  {
    id: "upload",
    label: "Image Upload",
    description: "Upload a UI screenshot to analyze"
  },
  {
    id: "vision",
    label: "AI Vision Analysis",
    description: "Analyzing UI elements and structure"
  },
  {
    id: "generate",
    label: "SQL Generation",
    description: "Generating SQL from the analysis"
  },
  {
    id: "execute",
    label: "Execute",
    description: "Ready to execute the generated SQL"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const [sqlResult, setSqlResult] = useState<SqlGenerationResult | null>(null);
  const [executionResult, setExecutionResult] = useState<string>("");
  
  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setCurrentStepIndex(1);
    
    try {
      setIsProcessing(true);
      
      // Process with Vision API
      const analysis = await analyzeUIScreenshot(file);
      setVisionResult(analysis);
      setCurrentStepIndex(2);
      
      // Generate SQL
      const sql = await generateSqlFromAnalysis(analysis);
      setSqlResult(sql);
      setCurrentStepIndex(3);
      
      // Switch to the SQL tab
      setActiveTab("sql");
      
      toast.success("SQL generated successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExecuteSql = async () => {
    if (!sqlResult) return;
    
    try {
      setExecutionResult("");
      setIsProcessing(true);
      
      const result = await executeSql(sqlResult.sql);
      
      setExecutionResult(result.message);
      setActiveTab("result");
      toast.success("SQL executed successfully!");
    } catch (error) {
      console.error("Error executing SQL:", error);
      toast.error("Failed to execute SQL. Please check the syntax.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full px-6 py-6 lg:py-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">UI to SQL Generator</h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Transform UI screenshots into SQL scripts using AI vision. Upload a database schema or UI mockup image, 
            and get executable SQL code generated automatically.
          </p>
        </div>
      </header>
      
      <main className="flex-1 flex items-start w-full py-6 lg:py-10">
        <div className="max-w-5xl w-full mx-auto px-6 grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Processing Steps</CardTitle>
              <CardDescription>Track your progress through the workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessingSteps
                steps={processingSteps}
                currentStepIndex={currentStepIndex}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {activeTab === "upload" 
                  ? "Upload UI Screenshot" 
                  : activeTab === "sql" 
                    ? "Generated SQL" 
                    : "Execution Result"}
              </CardTitle>
              <CardDescription>
                {activeTab === "upload" 
                  ? "Upload a screenshot of your UI or database schema" 
                  : activeTab === "sql" 
                    ? "Review and edit the generated SQL" 
                    : "View the execution output"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="upload" disabled={isProcessing} className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload</span>
                  </TabsTrigger>
                  <TabsTrigger value="sql" disabled={!sqlResult || isProcessing} className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>SQL</span>
                  </TabsTrigger>
                  <TabsTrigger value="result" disabled={!executionResult} className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span>Result</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                  <FileUpload 
                    onFileSelected={handleFileSelected} 
                    className="min-h-[300px]"
                  />
                </TabsContent>
                
                <TabsContent value="sql" className="mt-0">
                  {isProcessing ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <LoadingIndicator text="Generating SQL..." />
                    </div>
                  ) : sqlResult ? (
                    <MonacoEditor
                      value={sqlResult.sql}
                      language="sql"
                      height="350px"
                      onExecute={handleExecuteSql}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-muted-foreground">
                      <Code className="h-16 w-16 opacity-20" />
                      <p>No SQL generated yet. Upload an image first.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="result" className="mt-0">
                  {executionResult ? (
                    <div className="bg-secondary/50 border rounded-lg p-4 min-h-[200px]">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        Execution Result
                      </h3>
                      <p className="text-sm">{executionResult}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-muted-foreground">
                      <Terminal className="h-16 w-16 opacity-20" />
                      <p>Execute the SQL to see results here.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            
            {sqlResult && (
              <CardFooter className="border-t bg-muted/30 px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Generated Tables: </span>
                  {sqlResult.tables.join(", ")}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      
      <footer className="w-full py-4 px-6 border-t">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-sm text-muted-foreground">UI to SQL Generator</p>
          <div className="text-sm text-muted-foreground flex items-center">
            <span>Built with</span>
            <Cpu className="h-4 w-4 mx-1" />
            <span>AI Vision</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
