// Teacher reference programs. Never pass this module to the student editor.
import type { Block, BlockKind } from "./blocks";
let serial = 0;
const b = (kind: BlockKind, count?: number, body?: Block[], otherwise?: Block[]): Block => ({ id: `reference-${++serial}`, kind, ...(count !== undefined ? { count } : {}), ...(body ? { body } : {}), ...(otherwise ? { otherwise } : {}) });
export const blockSolutions: Record<string, Block[]> = {
  "first-swim": [b("move",3)],
  "turn-the-corner": [b("move",2),b("right"),b("move",2)],
  "star-delivery": [b("move",1),b("collect"),b("move",2),b("collect"),b("move",1)],
  "repeat-staircase": [b("repeat",3,[b("move",1),b("right"),b("move",1),b("left")])],
  "square-patrol": [b("repeat",4,[b("collect"),b("move",2),b("right")])],
  "sense-the-wall": [b("ifClear",undefined,[b("move",1)],[b("right"),b("move",1)])],
  "ocean-sweep": [b("collect"),b("repeat",2,[b("move",1),b("collect")]),b("right"),b("move",1),b("right"),b("collect"),b("repeat",2,[b("move",1),b("collect")])],
  "adaptive-explorer": [b("repeat",5,[b("ifClear",undefined,[b("move",1)],[b("right")])])],
};
