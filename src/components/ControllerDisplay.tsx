import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mapping, Mode } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface ControllerDisplayProps {
  mapping: Mapping | null;
  activeModeId: string | null;
  className?: string;
}
// Button definitions with SVG paths and positions
const BUTTONS = {
  // Face Buttons
  A: { cx: 420, cy: 230, r: 18, label: 'A', color: 'fill-green-500' },
  B: { cx: 460, cy: 190, r: 18, label: 'B', color: 'fill-red-500' },
  X: { cx: 380, cy: 190, r: 18, label: 'X', color: 'fill-blue-500' },
  Y: { cx: 420, cy: 150, r: 18, label: 'Y', color: 'fill-yellow-500' },
  // D-Pad (Simplified as circles for hit targets, visually a cross)
  DpadUp: { cx: 180, cy: 230, r: 12, label: '↑' },
  DpadDown: { cx: 180, cy: 270, r: 12, label: '↓' },
  DpadLeft: { cx: 160, cy: 250, r: 12, label: '←' },
  DpadRight: { cx: 200, cy: 250, r: 12, label: '→' },
  // Center Buttons
  Start: { cx: 330, cy: 180, r: 10, label: '≡' },
  Select: { cx: 270, cy: 180, r: 10, label: '⧉' },
  Guide: { cx: 300, cy: 140, r: 22, label: 'X' },
  // Sticks (Click)
  LS: { cx: 180, cy: 150, r: 25, label: 'LS' },
  RS: { cx: 380, cy: 270, r: 25, label: 'RS' },
  // Shoulders & Triggers (Represented as paths or rects at top)
  LB: { type: 'rect', x: 120, y: 60, w: 80, h: 30, rx: 5, label: 'LB' },
  RB: { type: 'rect', x: 400, y: 60, w: 80, h: 30, rx: 5, label: 'RB' },
  LT: { type: 'path', d: "M 130 30 Q 170 30 190 50 L 110 50 Q 110 30 130 30", label: 'LT' },
  RT: { type: 'path', d: "M 470 30 Q 430 30 410 50 L 490 50 Q 490 30 470 30", label: 'RT' },
};
export function ControllerDisplay({ mapping, activeModeId, className }: ControllerDisplayProps) {
  const activeMode = useMemo(() => {
    return mapping?.modes.find(m => m.id === activeModeId);
  }, [mapping, activeModeId]);
  const getBinding = (btnId: string) => {
    return activeMode?.bindings[btnId];
  };
  const hasBinding = (btnId: string) => {
    return !!getBinding(btnId);
  };
  return (
    <div className={cn("relative w-full aspect-video flex items-center justify-center select-none", className)}>
      <svg
        viewBox="0 0 600 400"
        className="w-full h-full max-w-[800px] drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Controller Body Outline */}
        <path
          d="M 150 100 
             C 100 100, 50 150, 50 250 
             C 50 350, 120 380, 180 320 
             L 220 280 
             L 380 280 
             L 420 320 
             C 480 380, 550 350, 550 250 
             C 550 150, 500 100, 450 100 
             Z"
          className="fill-slate-800 stroke-slate-700 stroke-2"
        />
        {/* Decorative Lines */}
        <path d="M 220 280 Q 300 300 380 280" className="fill-none stroke-slate-900/50 stroke-2" />
        {/* Render Buttons */}
        <TooltipProvider delayDuration={0}>
          {Object.entries(BUTTONS).map(([id, def]) => {
            const binding = getBinding(id);
            const isActive = !!binding;
            // Tooltip Content
            const tooltipContent = isActive ? (
              <div className="space-y-1 text-xs">
                <div className="font-bold text-primary">{id} Mapped</div>
                {binding.tap && <div>Tap: <span className="text-cyan-400">{binding.tap.value}</span></div>}
                {binding.hold && <div>Hold: <span className="text-orange-400">{binding.hold.value}</span></div>}
                {binding.doubleTap && <div>D-Tap: <span className="text-purple-400">{binding.doubleTap.value}</span></div>}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">{id} (Unmapped)</div>
            );
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <motion.g
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    {/* Render Shape based on definition */}
                    {'d' in def ? (
                      <path
                        d={def.d}
                        className={cn(
                          "transition-colors duration-200",
                          isActive ? "fill-cyan-600 stroke-cyan-400" : "fill-slate-700 stroke-slate-600"
                        )}
                      />
                    ) : 'type' in def && def.type === 'rect' ? (
                      <rect
                        x={def.x} y={def.y} width={def.w} height={def.h} rx={def.rx}
                        className={cn(
                          "transition-colors duration-200",
                          isActive ? "fill-cyan-600 stroke-cyan-400" : "fill-slate-700 stroke-slate-600"
                        )}
                      />
                    ) : 'cx' in def ? (
                      <circle
                        cx={def.cx} cy={def.cy} r={def.r}
                        className={cn(
                          "transition-colors duration-200",
                          isActive ? "fill-cyan-600 stroke-cyan-400" : "fill-slate-700 stroke-slate-600",
                          // @ts-ignore - color is optional
                          def.color && !isActive ? def.color + "/20" : ""
                        )}
                      />
                    ) : null}
                    {/* Label */}
                    {'cx' in def && (
                      <text
                        x={def.cx} y={def.cy}
                        dy={4}
                        textAnchor="middle"
                        className="fill-white text-[10px] font-bold pointer-events-none"
                      >
                        {def.label}
                      </text>
                    )}
                    {'type' in def && def.type === 'rect' && (
                      <text
                        x={def.x! + def.w!/2} y={def.y! + def.h!/2}
                        dy={4}
                        textAnchor="middle"
                        className="fill-white text-[10px] font-bold pointer-events-none"
                      >
                        {def.label}
                      </text>
                    )}
                  </motion.g>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 border-slate-800">
                  {tooltipContent}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </svg>
    </div>
  );
}