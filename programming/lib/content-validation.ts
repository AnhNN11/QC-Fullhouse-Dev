import type { PracticeResource } from "./resources";
import type { LearningRoadmap } from "./roadmaps";
import type { RoadmapGuide } from "./roadmap-guides";
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Nội dung phải là object JSON.");
  return value as Record<string, unknown>;
}
function text(value: unknown, max = 10000): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error("Thiếu nội dung hoặc nội dung quá dài.");
  return value.trim();
}
function list(value: unknown, max = 50): unknown[] {
  if (!Array.isArray(value) || !value.length || value.length > max) throw new Error("Danh sách phải có từ 1 đến " + max + " mục.");
  return value;
}
function url(value: unknown) {
  const result = text(value, 2000);
  if (new URL(result).protocol !== "https:") throw new Error("Liên kết tài liệu phải dùng HTTPS.");
  return result;
}
export function contentSlug(value: unknown): string {
  const result = text(value, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) throw new Error("Slug chỉ gồm chữ thường, số và dấu gạch ngang.");
  return result;
}
export function validateResource(value: unknown, slug: string): PracticeResource {
  const d = object(value);
  if (d.id !== slug) throw new Error("ID trong nội dung phải trùng slug.");
  if (!Number.isSafeInteger(d.minutes) || Number(d.minutes) < 1 || Number(d.minutes) > 10000) throw new Error("Thời lượng phải từ 1–10000 phút.");
  return { id: slug, title: text(d.title, 200), topic: text(d.topic, 100), kind: text(d.kind, 100), level: text(d.level, 100), minutes: Number(d.minutes), description: text(d.description), setup: text(d.setup), tasks: list(d.tasks).map(v => text(v)), checks: list(d.checks).map(v => text(v)), hint: text(d.hint), source: url(d.source) };
}
export function validateRoadmap(value: unknown, slug: string): { roadmap: LearningRoadmap; guide: RoadmapGuide } {
  const bundle = object(value), r = object(bundle.roadmap), g = object(bundle.guide);
  if (r.slug !== slug) throw new Error("Slug của lộ trình phải khớp.");
  const ids = new Set<string>();
  const stages = list(r.stages, 20).map(value => {
    const stage = object(value);
    return { title: text(stage.title, 200), nodes: list(stage.nodes, 30).map(value => {
      const node = object(value), id = contentSlug(node.id);
      if (ids.has(id)) throw new Error("ID chủ đề không được trùng nhau.");
      ids.add(id);
      return { id, title: text(node.title, 200), description: text(node.description), practice: text(node.practice) };
    }) };
  });
  const guides = list(g.stages, 20).map(value => {
    const stage = object(value);
    return { label: text(stage.label, 200), focus: text(stage.focus), checkpoint: text(stage.checkpoint), resources: list(stage.resources, 20).map(value => { const source = object(value); return { title: text(source.title, 200), href: url(source.href) }; }) };
  });
  if (stages.length !== guides.length) throw new Error("Số chặng của bản đồ và hướng dẫn phải bằng nhau.");
  return { roadmap: { slug, title: text(r.title, 200), category: text(r.category, 100), description: text(r.description), symbol: text(r.symbol, 20), course: contentSlug(r.course), outcome: text(r.outcome), stages }, guide: { audience: text(g.audience), prerequisite: text(g.prerequisite), project: text(g.project), deliverables: list(g.deliverables).map(v => text(v)), stages: guides } };
}
