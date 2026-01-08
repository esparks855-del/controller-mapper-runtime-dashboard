import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Gamepad2, Code2, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfigStore } from '@/store/configStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { toast } from 'sonner';
export function HomePage() {
  const navigate = useNavigate();
  const loadConfig = useConfigStore(s => s.loadConfig);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        loadConfig(text);
        toast.success("Configuration Loaded", { description: `Loaded ${file.name} successfully.` });
        navigate('/visualizer');
      }
    };
    reader.readAsText(file);
  }, [loadConfig, navigate]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1
  });
  return (
    <AppLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative text-center space-y-6 py-12 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-xs font-medium text-secondary-foreground mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Runtime Engine v1.0 Ready
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          >
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Inputs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            The ultimate companion dashboard for your Windows Controller Runtime. Visualize, validate, and manage your mapping profiles with precision.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="h-12 px-8 text-base bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-900/20" onClick={() => navigate('/visualizer')}>
              Open Visualizer <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Download Runtime
            </Button>
          </motion.div>
        </section>
        {/* Quick Upload Section */}
        <section className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div 
              {...getRootProps()} 
              className={`
                relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed 
                transition-all duration-300 p-12 text-center
                ${isDragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-muted-foreground/25 hover:border-cyan-500/50 hover:bg-secondary/50'}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-background shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform duration-300">
                  <Upload className={`w-8 h-8 ${isDragActive ? 'text-cyan-500' : 'text-muted-foreground'}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Drop your config here</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports .json files exported from the Editor
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur border-muted/50">
            <CardHeader>
              <Gamepad2 className="w-10 h-10 text-cyan-500 mb-2" />
              <CardTitle>Interactive Visualizer</CardTitle>
              <CardDescription>See your mappings come to life on a virtual controller.</CardDescription>
            </CardHeader>
            <CardContent>
              Verify tap, hold, and double-tap actions instantly with visual feedback.
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-muted/50">
            <CardHeader>
              <Code2 className="w-10 h-10 text-purple-500 mb-2" />
              <CardTitle>Schema Validation</CardTitle>
              <CardDescription>Never crash your runtime with invalid configs.</CardDescription>
            </CardHeader>
            <CardContent>
              Built-in Zod validation ensures your JSON structure is perfect before deployment.
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-muted/50">
            <CardHeader>
              <Zap className="w-10 h-10 text-yellow-500 mb-2" />
              <CardTitle>Instant Preview</CardTitle>
              <CardDescription>Edit JSON and see changes reflect in real-time.</CardDescription>
            </CardHeader>
            <CardContent>
              Monaco-powered editor allows for quick tweaks and immediate visual verification.
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}