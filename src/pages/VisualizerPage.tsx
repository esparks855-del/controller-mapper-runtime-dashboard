import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useConfigStore } from '@/store/configStore';
import { useProfileStore } from '@/store/profileStore';
import { ControllerDisplay } from '@/components/ControllerDisplay';
import { BindingEditor } from '@/components/BindingEditor';
import { AppLayout } from '@/components/layout/AppLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle2, Save, Copy, Download, FileJson } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
export function VisualizerPage() {
  const rawJson = useConfigStore(s => s.rawJson);
  const config = useConfigStore(s => s.config);
  const validationError = useConfigStore(s => s.validationError);
  const activeModeId = useConfigStore(s => s.activeModeId);
  const currentProfileId = useConfigStore(s => s.currentProfileId);
  const setRawJson = useConfigStore(s => s.setRawJson);
  const setActiveModeId = useConfigStore(s => s.setActiveModeId);
  const loadConfig = useConfigStore(s => s.loadConfig);
  const addProfile = useProfileStore(s => s.addProfile);
  const updateProfile = useProfileStore(s => s.updateProfile);
  const isMobile = useIsMobile();
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);
  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setRawJson(value);
    }
  };
  const handleButtonSelect = (buttonId: string) => {
    setSelectedButtonId(buttonId);
  };
  const handleEditorClose = () => {
    setSelectedButtonId(null);
  };
  const handleSave = () => {
    if (!config) {
      toast.error("Cannot save invalid configuration");
      return;
    }
    if (currentProfileId) {
      updateProfile(currentProfileId, config);
      toast.success("Profile Saved", { description: `Updated "${config.title}"` });
    } else {
      const newProfile = addProfile(config);
      loadConfig(JSON.stringify(newProfile), newProfile.id);
      toast.success("Profile Created", { description: `Saved as "${config.title}"` });
    }
  };
  const handleSaveCopy = () => {
    if (!config) return;
    const copyConfig = { ...config, title: `${config.title} (Copy)` };
    const newProfile = addProfile(copyConfig);
    loadConfig(JSON.stringify(newProfile), newProfile.id);
    toast.success("Copy Created", { description: `Saved as "${copyConfig.title}"` });
  };
  const handleDownload = () => {
    if (!config) return;
    try {
      const blob = new Blob([rawJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'config'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Download Started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download Failed");
    }
  };
  // Get current binding for the selected button
  const activeMode = config?.modes.find(m => m.id === activeModeId);
  const currentBinding = selectedButtonId && activeMode ? activeMode.bindings[selectedButtonId] : undefined;
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
              {/* Visualizer Header / Toolbar */}
              <div className="p-3 border-b bg-background/80 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <h2 className="font-semibold hidden sm:block">Visualizer</h2>
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Mode:</span>
                    <Select
                      value={activeModeId || ''}
                      onValueChange={setActiveModeId}
                      disabled={!config}
                    >
                      <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs">
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
                <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave} disabled={!config || !!validationError}>
                          <Save className="w-4 h-4 text-cyan-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save Profile</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveCopy} disabled={!config || !!validationError}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save as Copy</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} disabled={!config || !!validationError}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download JSON</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {/* Visualizer Canvas */}
              <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                {config ? (
                  <div className="w-full max-w-3xl animate-fade-in">
                    <ControllerDisplay
                      mapping={config}
                      activeModeId={activeModeId}
                      onButtonSelect={handleButtonSelect}
                      selectedButtonId={selectedButtonId}
                    />
                    <div className="mt-8 text-center">
                      <h3 className="text-xl font-bold text-white tracking-tight">{config.title || "Untitled Profile"}</h3>
                      <p className="text-sm text-cyan-400/80 font-mono mt-1">
                        {config.modes.find(m => m.id === activeModeId)?.name || "Unknown Mode"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-4 opacity-60">
                        Select a button to configure its bindings
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
        {/* Binding Editor Sheet */}
        {selectedButtonId && activeModeId && (
          <BindingEditor
            isOpen={!!selectedButtonId}
            onClose={handleEditorClose}
            buttonId={selectedButtonId}
            modeId={activeModeId}
            currentBinding={currentBinding}
          />
        )}
      </div>
    </AppLayout>
  );
}