import React, { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useConfigStore } from '@/store/configStore';
import { ControllerDisplay } from '@/components/ControllerDisplay';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
export function VisualizerPage() {
  const rawJson = useConfigStore(s => s.rawJson);
  const config = useConfigStore(s => s.config);
  const validationError = useConfigStore(s => s.validationError);
  const activeModeId = useConfigStore(s => s.activeModeId);
  const setRawJson = useConfigStore(s => s.setRawJson);
  const setActiveModeId = useConfigStore(s => s.setActiveModeId);
  const isMobile = useIsMobile();
  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setRawJson(value);
    }
  };
  return (
    <AppLayout container={false} className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 h-full">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full w-full rounded-lg border bg-background">
          {/* Left Panel: Editor */}
          <ResizablePanel defaultSize={40} minSize={20} className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                JSON Configuration
              </h2>
              <div className="text-xs text-muted-foreground">
                {validationError ? (
                  <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invalid</span>
                ) : (
                  <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid</span>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={rawJson}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            {validationError && (
              <div className="p-3 bg-red-900/20 border-t border-red-900/50 text-red-200 text-xs font-mono overflow-y-auto max-h-32">
                {validationError}
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Right Panel: Visualizer */}
          <ResizablePanel defaultSize={60} minSize={30} className="bg-slate-950/50 relative">
            <div className="absolute inset-0 flex flex-col">
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between z-10">
                <h2 className="font-semibold">Controller Visualizer</h2>
                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active Mode:</span>
                  <Select 
                    value={activeModeId || ''} 
                    onValueChange={setActiveModeId}
                    disabled={!config}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {config?.modes.map(mode => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                {config ? (
                  <div className="w-full max-w-3xl animate-fade-in">
                    <ControllerDisplay 
                      mapping={config} 
                      activeModeId={activeModeId} 
                    />
                    <div className="mt-8 text-center">
                      <h3 className="text-xl font-bold text-white">{config.title || "Untitled Profile"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {config.modes.find(m => m.id === activeModeId)?.name || "Unknown Mode"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Invalid Configuration. Please fix JSON errors to visualize.</p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
}