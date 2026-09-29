export type BlockKind = "move" | "left" | "right" | "repeat" | "ifClear" | "collect";
export type Block = { id: string; kind: BlockKind; count?: number; body?: Block[]; otherwise?: Block[] };
export type Point = { x: number; y: number };
export type BlockWorld = { name: string; size: number; start: Point & { direction: number }; goal: Point; walls: Point[]; stars: Point[] };
export type BlockChallenge = { slug: string; title: string; description: string; level: string; instructions: string[]; allowed: BlockKind[]; maxBlocks: number; worlds: BlockWorld[] };
export type Frame = Point & { direction: number; collected: string[]; blockId: string };
export type WorldResult = { name: string; reached: boolean; collected: number; totalStars: number; error?: string; frames: Frame[]; score: number };
export const blockLabels: Record<BlockKind, string> = { move: "Đi tới", left: "Quay trái 90°", right: "Quay phải 90°", repeat: "Lặp lại", ifClear: "Nếu phía trước trống", collect: "Nhặt sao" };
const key = (p: Point) => `${p.x},${p.y}`;
export function validateProgram(raw: unknown, allowed: BlockKind[]): Block[] {
  let total = 0;
  const ids = new Set<string>();
  function parse(raw: unknown, depth: number): Block[] {
    if (!Array.isArray(raw) || depth > 6) throw new Error("Chương trình quá sâu hoặc không đúng cấu trúc.");
    return raw.map(value => {
      if (++total > 60 || !value || typeof value !== "object") throw new Error("Tối đa 60 khối trong một chương trình.");
      const b = value as Record<string, unknown>;
      if (typeof b.id !== "string" || b.id.length > 80 || !b.id || ids.has(b.id)) throw new Error("ID khối không hợp lệ hoặc bị trùng.");
      ids.add(b.id);
      if (!allowed.includes(b.kind as BlockKind)) throw new Error("Bài này không cho phép loại khối đã gửi.");
      const result: Block = { id: b.id, kind: b.kind as BlockKind };
      if (b.kind === "move" || b.kind === "repeat") {
        if (!Number.isSafeInteger(b.count) || Number(b.count) < 1 || Number(b.count) > (b.kind === "repeat" ? 20 : 10)) throw new Error("Số bước: 1–10; số lần lặp: 1–20.");
        result.count = Number(b.count);
      }
      if (b.kind === "repeat" || b.kind === "ifClear") result.body = parse(b.body, depth + 1);
      if (b.kind === "ifClear") result.otherwise = parse(b.otherwise, depth + 1);
      return result;
    });
  }
  return parse(raw, 0);
}
export function countBlocks(program: Block[]): number { return program.reduce((n, b) => n + 1 + countBlocks(b.body ?? []) + countBlocks(b.otherwise ?? []), 0); }
export function runWorld(program: Block[], world: BlockWorld): WorldResult {
  let { x, y, direction } = world.start;
  let operations = 0, error: string | undefined;
  const walls = new Set(world.walls.map(key)), stars = new Set(world.stars.map(key)), collected = new Set<string>();
  const frames: Frame[] = [{ x, y, direction, collected: [], blockId: "start" }];
  const delta = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  function clear() { const nx = x + delta[direction][0], ny = y + delta[direction][1]; return nx >= 0 && ny >= 0 && nx < world.size && ny < world.size && !walls.has(`${nx},${ny}`); }
  function frame(id: string) { frames.push({ x, y, direction, collected: [...collected], blockId: id }); }
  function execute(blocks: Block[]) {
    for (const b of blocks) {
      if (++operations > 500) throw new Error("Vượt 500 thao tác. Hãy giảm vòng lặp.");
      switch (b.kind) {
        case "move":
          for (let i = 0; i < b.count!; i++) {
            if (++operations > 500) throw new Error("Vượt 500 thao tác.");
            if (!clear()) throw new Error("Cá heo gặp tường hoặc ra ngoài bản đồ.");
            x += delta[direction][0]; y += delta[direction][1]; frame(b.id);
          }
          break;
        case "left": direction = (direction + 3) % 4; frame(b.id); break;
        case "right": direction = (direction + 1) % 4; frame(b.id); break;
        case "collect":
          if (!stars.has(`${x},${y}`)) throw new Error("Ô hiện tại không có sao để nhặt.");
          collected.add(`${x},${y}`); frame(b.id); break;
        case "repeat": for (let i = 0; i < b.count!; i++) { if (++operations > 500) throw new Error("Vượt 500 thao tác."); execute(b.body ?? []); } break;
        case "ifClear": execute(clear() ? b.body ?? [] : b.otherwise ?? []); break;
      }
    }
  }
  try { execute(program); } catch (reason) { error = reason instanceof Error ? reason.message : "Chưa chạy được."; }
  const reached = !error && x === world.goal.x && y === world.goal.y;
  const collectionScore = stars.size ? Math.round(collected.size / stars.size * 30) : 30;
  // A collision or exhausted execution budget cannot count as a successful solution.
  const score = reached ? 60 + collectionScore : Math.min(30, stars.size ? collectionScore : 0);
  return { name: world.name, reached, collected: collected.size, totalStars: stars.size, error, frames, score };
}
export function gradeBlocks(challenge: BlockChallenge, raw: unknown) {
  const program = validateProgram(raw, challenge.allowed);
  const blockCount = countBlocks(program);
  const results = challenge.worlds.map(world => runWorld(program, world));
  const passed = results.every(result => result.reached && result.collected === result.totalStars);
  const efficient = blockCount <= challenge.maxBlocks;
  const score = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) + (passed && efficient ? 10 : 0);
  return { score, passed, efficient, blockCount, results };
}
export function validateChallenge(raw: unknown): BlockChallenge {
  if (!raw || typeof raw !== "object") throw new Error("Cấu hình bài không hợp lệ.");
  const c = raw as BlockChallenge;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug) || c.slug.length > 80) throw new Error("Slug bài không hợp lệ.");
  for (const field of [c.title, c.description, c.level]) if (typeof field !== "string" || !field.trim() || field.length > 3000) throw new Error("Thiếu tiêu đề, mô tả hoặc trình độ.");
  if (!Array.isArray(c.instructions) || c.instructions.length < 1 || c.instructions.length > 12 || c.instructions.some(s => typeof s !== "string" || !s.trim() || s.length > 1000)) throw new Error("Cần 1–12 hướng dẫn.");
  if (!Array.isArray(c.allowed) || !c.allowed.length || c.allowed.some(k => !Object.hasOwn(blockLabels, k)) || new Set(c.allowed).size !== c.allowed.length) throw new Error("Danh sách khối không hợp lệ.");
  if (!Number.isSafeInteger(c.maxBlocks) || c.maxBlocks < 1 || c.maxBlocks > 60) throw new Error("Ngân sách khối: 1–60.");
  if (!Array.isArray(c.worlds) || !c.worlds.length || c.worlds.length > 5) throw new Error("Cần 1–5 bản đồ kiểm thử.");
  for (const w of c.worlds) {
    if (!w || typeof w.name !== "string" || !w.name.trim() || w.name.length > 100 || !Number.isSafeInteger(w.size) || w.size < 3 || w.size > 8) throw new Error("Tên hoặc kích thước bản đồ không hợp lệ (3–8).");
    const point = (p: Point) => p && Number.isSafeInteger(p.x) && Number.isSafeInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < w.size && p.y < w.size;
    if (!point(w.start) || !point(w.goal) || !Number.isSafeInteger(w.start.direction) || w.start.direction < 0 || w.start.direction > 3) throw new Error("Điểm đầu, đích hoặc hướng không hợp lệ.");
    for (const list of [w.walls, w.stars]) if (!Array.isArray(list) || list.length > 64 || list.some(p => !point(p)) || new Set(list.map(key)).size !== list.length) throw new Error("Tường hoặc sao không hợp lệ.");
    const walls = new Set(w.walls.map(key));
    if (walls.has(key(w.start)) || walls.has(key(w.goal)) || w.stars.some(p => walls.has(key(p)))) throw new Error("Điểm đầu, đích và sao không được nằm trong tường.");
  }
  return { slug: c.slug, title: c.title, description: c.description, level: c.level, instructions: c.instructions, allowed: c.allowed, maxBlocks: c.maxBlocks, worlds: c.worlds };
}
