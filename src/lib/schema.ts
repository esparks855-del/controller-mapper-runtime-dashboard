import { z } from 'zod';
export const ActionSchema = z.object({
  type: z.enum(['key', 'mouseBtn', 'mouseMove', 'macro', 'modeSwitch']),
  value: z.string().describe("The key code, mouse button, or value associated with the action"),
  params: z.record(z.string(), z.any()).optional().describe("Optional parameters for complex actions"),
});
export type Action = z.infer<typeof ActionSchema>;
export const BindingSchema = z.object({
  tap: ActionSchema.optional(),
  hold: ActionSchema.optional(),
  doubleTap: ActionSchema.optional(),
  release: ActionSchema.optional(),
});
export type Binding = z.infer<typeof BindingSchema>;
export const ModeSchema = z.object({
  id: z.string(),
  name: z.string(),
  bindings: z.record(z.string(), BindingSchema).describe("Map of button IDs (e.g., 'A', 'RT') to bindings"),
});
export type Mode = z.infer<typeof ModeSchema>;
export const MappingSchema = z.object({
  title: z.string().optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  controllerType: z.enum(['xbox', 'ps', 'generic']).default('xbox'),
  defaultMode: z.string(),
  modes: z.array(ModeSchema),
});
export type Mapping = z.infer<typeof MappingSchema>;
// Default empty mapping for initialization
export const DEFAULT_MAPPING: Mapping = {
  title: "New Profile",
  version: "1.0.0",
  controllerType: "xbox",
  defaultMode: "default",
  modes: [
    {
      id: "default",
      name: "Default Mode",
      bindings: {}
    }
  ]
};