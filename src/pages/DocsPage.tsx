import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Terminal, FileJson, AlertTriangle } from 'lucide-react';
export function DocsPage() {
  return (
    <AppLayout container>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about the Controller Mapper Runtime Engine.
          </p>
        </div>
        <Tabs defaultValue="installation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>
          <TabsContent value="installation" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Runtime</CardTitle>
                <CardDescription>Get the latest version of the runtime engine for your platform.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 h-16 text-lg" variant="outline">
                  <Download className="mr-2 h-5 w-5" />
                  Windows (x64)
                  <span className="ml-2 text-xs text-muted-foreground block sm:inline">v1.0.2</span>
                </Button>
                <Button className="flex-1 h-16 text-lg" variant="outline">
                  <Download className="mr-2 h-5 w-5" />
                  Windows (ARM64)
                  <span className="ml-2 text-xs text-muted-foreground block sm:inline">v1.0.2</span>
                </Button>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Windows 10 (Version 2004 or later) or Windows 11</li>
                <li>.NET 8.0 Runtime (Desktop)</li>
                <li>ViGEmBus Driver (for virtual controller emulation)</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="usage" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Command Line Interface</h3>
              <p className="text-muted-foreground">
                The runtime engine is a command-line application. You can run it directly or create a shortcut.
              </p>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-200 border border-slate-800">
                <div className="flex items-center gap-2 text-muted-foreground mb-2 border-b border-slate-800 pb-2">
                  <Terminal className="w-4 h-4" />
                  <span>PowerShell</span>
                </div>
                <p># Basic usage</p>
                <p className="text-cyan-400">.\ControllerMapper.exe --config "C:\Configs\halo-infinite.json"</p>
                <br />
                <p># Run in background (minimized)</p>
                <p className="text-cyan-400">.\ControllerMapper.exe --config "C:\Configs\halo-infinite.json" --background</p>
                <br />
                <p># Enable verbose logging</p>
                <p className="text-cyan-400">.\ControllerMapper.exe --config "C:\Configs\halo-infinite.json" --verbose</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="schema" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">JSON Configuration Structure</h3>
              <p className="text-muted-foreground">
                The runtime expects a strict JSON structure. Use the <span className="font-bold text-foreground">Visualizer</span> to validate your files.
              </p>
              <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileJson className="w-5 h-5 text-yellow-500" />
                    <CardTitle className="text-slate-200">Schema Reference</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs sm:text-sm text-slate-300 overflow-x-auto">
{`{
  "title": "String (Optional)",
  "version": "String (Optional)",
  "controllerType": "xbox" | "ps" | "generic",
  "defaultMode": "String (ID of the starting mode)",
  "modes": [
    {
      "id": "String (Unique ID)",
      "name": "String (Display Name)",
      "bindings": {
        "BUTTON_ID": {
          "tap": { "type": "ActionType", "value": "Value" },
          "hold": { "type": "ActionType", "value": "Value" },
          "doubleTap": { "type": "ActionType", "value": "Value" }
        }
      }
    }
  ]
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="troubleshooting" className="space-y-6 mt-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle>Controller Not Detected</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensure your controller is connected via USB or Bluetooth before starting the runtime. 
                    If using an Xbox controller, verify it appears in Windows "Game Controllers" settings.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <CardTitle>Input Lag / Latency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    High CPU usage can cause input lag. Try running the process with "High" priority in Task Manager.
                    Ensure you are not running other mapping software (Steam Input, DS4Windows) simultaneously.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}