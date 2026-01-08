import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Binding, Action } from '@/lib/schema';
import { useConfigStore } from '@/store/configStore';
import { Trash2, Save } from 'lucide-react';
interface BindingEditorProps {
  isOpen: boolean;
  onClose: () => void;
  buttonId: string;
  modeId: string;
  currentBinding?: Binding;
}
const EMPTY_ACTION: Action = { type: 'key', value: '' };
export function BindingEditor({ isOpen, onClose, buttonId, modeId, currentBinding }: BindingEditorProps) {
  const updateBinding = useConfigStore(s => s.updateBinding);
  // Local state for the form to prevent jittery updates, though we could sync directly
  const [binding, setBinding] = useState<Binding>(currentBinding || {});
  // Reset state when opening for a different button
  useEffect(() => {
    setBinding(currentBinding || {});
  }, [buttonId, currentBinding, isOpen]);
  const handleActionChange = (
    trigger: 'tap' | 'hold' | 'doubleTap',
    field: keyof Action,
    value: string
  ) => {
    const newBinding = { ...binding };
    // Ensure the action object exists
    if (!newBinding[trigger]) {
      newBinding[trigger] = { ...EMPTY_ACTION };
    }
    // Update the specific field
    if (newBinding[trigger]) {
      // @ts-ignore - we know the type matches
      newBinding[trigger]![field] = value;
    }
    setBinding(newBinding);
    // Auto-save on change for instant feedback
    updateBinding(modeId, buttonId, newBinding);
  };
  const handleClearBinding = () => {
    const emptyBinding: Binding = {};
    setBinding(emptyBinding);
    updateBinding(modeId, buttonId, emptyBinding);
  };
  const renderActionForm = (trigger: 'tap' | 'hold' | 'doubleTap') => {
    const action = binding[trigger] || EMPTY_ACTION;
    const isConfigured = !!binding[trigger];
    return (
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Action Type</Label>
          <Select 
            value={action.type} 
            onValueChange={(val) => handleActionChange(trigger, 'type', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="key">Keyboard Key</SelectItem>
              <SelectItem value="mouseBtn">Mouse Button</SelectItem>
              <SelectItem value="mouseMove">Mouse Movement</SelectItem>
              <SelectItem value="macro">Macro</SelectItem>
              <SelectItem value="modeSwitch">Mode Switch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Value / Key Code</Label>
          <Input 
            value={action.value} 
            onChange={(e) => handleActionChange(trigger, 'value', e.target.value)}
            placeholder={action.type === 'key' ? 'e.g., VK_SPACE, A, B' : 'Value'}
          />
          <p className="text-xs text-muted-foreground">
            {action.type === 'key' ? 'Enter the key code or character.' : 'Enter the parameter value.'}
          </p>
        </div>
        {!isConfigured && (
          <div className="pt-2">
            <p className="text-xs text-yellow-500">
              * Start typing or select a type to configure this trigger.
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Configure <span className="text-cyan-500 font-mono">{buttonId}</span>
          </SheetTitle>
          <SheetDescription>
            Edit the behavior for this controller input in <span className="font-medium text-foreground">{modeId}</span> mode.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Tabs defaultValue="tap" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tap">Tap</TabsTrigger>
              <TabsTrigger value="hold">Hold</TabsTrigger>
              <TabsTrigger value="doubleTap">Double Tap</TabsTrigger>
            </TabsList>
            <TabsContent value="tap" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
              {renderActionForm('tap')}
            </TabsContent>
            <TabsContent value="hold" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
              {renderActionForm('hold')}
            </TabsContent>
            <TabsContent value="doubleTap" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
              {renderActionForm('doubleTap')}
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <Button variant="destructive" size="sm" onClick={handleClearBinding}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Binding
          </Button>
          <Button onClick={onClose}>
            <Save className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}