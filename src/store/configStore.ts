import { create } from 'zustand';
import { Mapping, MappingSchema, DEFAULT_MAPPING, Binding } from '@/lib/schema';
interface ConfigState {
  // State
  config: Mapping | null;
  rawJson: string;
  validationError: string | null;
  activeModeId: string | null;
  currentProfileId: string | null; // Track if we are editing a saved profile
  // Actions
  loadConfig: (json: string, profileId?: string) => void;
  setRawJson: (json: string) => void;
  setActiveModeId: (id: string | null) => void;
  updateBinding: (modeId: string, buttonId: string, binding: Binding) => void;
  reset: () => void;
}
export const useConfigStore = create<ConfigState>((set, get) => ({
  config: DEFAULT_MAPPING,
  rawJson: JSON.stringify(DEFAULT_MAPPING, null, 2),
  validationError: null,
  activeModeId: 'default',
  currentProfileId: null,
  loadConfig: (json: string, profileId?: string) => {
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
            : result.data.defaultMode,
          currentProfileId: profileId || null
        });
      } else {
        // It's valid JSON but invalid Schema
        // Fix: Use .issues instead of .errors to avoid TS issues if types are strict
        const errorMsg = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        set({
          rawJson: json,
          validationError: `Schema Error: ${errorMsg}`,
          currentProfileId: null
        });
      }
    } catch (e) {
      // Invalid JSON
      set({
        rawJson: json,
        validationError: e instanceof Error ? `JSON Error: ${e.message}` : "Invalid JSON",
        currentProfileId: null
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
      } else {
        const errorMsg = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        set({ validationError: errorMsg });
      }
    } catch (e) {
      set({ validationError: e instanceof Error ? e.message : "Invalid JSON" });
    }
  },
  setActiveModeId: (id) => set({ activeModeId: id }),
  updateBinding: (modeId: string, buttonId: string, binding: Binding) => {
    const { config } = get();
    if (!config) return;
    // Deep clone to avoid mutation issues
    const newConfig = JSON.parse(JSON.stringify(config)) as Mapping;
    const modeIndex = newConfig.modes.findIndex(m => m.id === modeId);
    if (modeIndex !== -1) {
      // Update the binding
      newConfig.modes[modeIndex].bindings[buttonId] = binding;
      // Update state with new config and synced JSON
      set({
        config: newConfig,
        rawJson: JSON.stringify(newConfig, null, 2),
        validationError: null
      });
    }
  },
  reset: () => set({
    config: DEFAULT_MAPPING,
    rawJson: JSON.stringify(DEFAULT_MAPPING, null, 2),
    validationError: null,
    activeModeId: 'default',
    currentProfileId: null
  })
}));