import type { Block, BlockKind } from "./blocks";
export type Slot = { parent: string | null; branch: "body" | "otherwise"; index: number };
export function newBlock(kind: BlockKind, id: string): Block { return { id, kind, ...(["move","repeat"].includes(kind) ? { count: kind === "repeat" ? 3 : 1 } : {}), ...(["repeat","ifClear"].includes(kind) ? { body: [] } : {}), ...(kind === "ifClear" ? { otherwise: [] } : {}) }; }
export function findBlock(program: Block[], id: string): Block | undefined {
  for (const b of program) { if (b.id === id) return b; const found = findBlock(b.body ?? [], id) ?? findBlock(b.otherwise ?? [], id); if (found) return found; }
}
export function removeBlock(program: Block[], id: string): Block[] { return program.filter(b => b.id !== id).map(b => ({ ...b, ...(b.body ? { body: removeBlock(b.body, id) } : {}), ...(b.otherwise ? { otherwise: removeBlock(b.otherwise, id) } : {}) })); }
export function insertBlock(program: Block[], block: Block, slot: Slot, moving = false): Block[] {
  if (slot.parent && findBlock([block], slot.parent)) throw new Error("Không thể thả một khối vào chính nó.");
  let index = slot.index;
  const oldArray = slot.parent ? findBlock(program, slot.parent)?.[slot.branch] : program;
  if (moving && oldArray) { const oldIndex = oldArray.findIndex(b => b.id === block.id); if (oldIndex >= 0 && oldIndex < index) index--; }
  const result = structuredClone(moving ? removeBlock(program, block.id) : program);
  const array = slot.parent ? findBlock(result, slot.parent)?.[slot.branch] : result;
  if (!array) throw new Error("Vị trí thả không còn tồn tại. Chọn vị trí khác.");
  array.splice(Math.max(0, Math.min(index, array.length)), 0, block);
  return result;
}
