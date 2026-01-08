import { create } from 'zustand';
import { Mapping, MappingSchema, DEFAULT_MAPPING } from '@/lib/schema';
interface ConfigState {
  // State
  config: Mapping | null;
  rawJson: string;
  validationError: string | null;
  activeModeId: string | null;
  // Actions
  loadConfig: (json: string) => void;
  setRawJson: (json: string) => void;
  setActiveModeId: (id: string | null) => void;
  reset: () => void;
}
export const useConfigStore = create<ConfigState>((set, get) => ({
  config: DEFAULT_MAPPING,
  rawJson: JSON.stringify(DEFAULT_MAPPING, null, 2),
  validationError: null,
  activeModeId: 'default',
  loadConfig: (json: string) => {
    try {
      const parsed = JSON.parse(json);
      const result = MappingSchema.safeParse(parsed);
      if (result.success) {
        set({ 
          config: result.data, 
          rawJson: json, 
          validationError: null,
          // If current active mode doesn't exist in new config, switch to default
          activeModeId: result.data.modes.find(m => m.id === get().activeModeId) 
            ? get().activeModeId 
            : result.data.defaultMode
        });
      } else {
        // It's valid JSON but invalid Schema
        const errorMsg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        set({ 
          rawJson: json, 
          validationError: `Schema Error: ${errorMsg}` 
        });
      }
    } catch (e) {
      // Invalid JSON
      set({ 
        rawJson: json, 
        validationError: e instanceof Error ? `JSON Error: ${e.message}` : "Invalid JSON" 
      });
    }
  },
  setRawJson: (json: string) => {
    // Just update the text, try to validate/update config if possible, but don't block typing
    set({ rawJson: json });
    try {
      const parsed = JSON.parse(json);
      const result = MappingSchema.safeParse(parsed);
      if (result.success) {
        set({ config: result.data, validationError: null });
        // Optional: Update active mode if needed, but usually better to keep user selection if valid
      } else {
        const errorMsg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        set({ validationError: errorMsg });
      }
    } catch (e) {
      set({ validationError: e instanceof Error ? e.message : "Invalid JSON" });
    }
  },
  setActiveModeId: (id) => set({ activeModeId: id }),
  reset: () => set({
    config: DEFAULT_MAPPING,
    rawJson: JSON.stringify(DEFAULT_MAPPING, null, 2),
    validationError: null,
    activeModeId: 'default'
  })
}));