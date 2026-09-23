"use client";

import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./entity-crud.module.css";

type EntityName = "teachers" | "contests";
type EntityRecord = Record<string, unknown> & { id: string };

type FieldDefinition = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "datetime-local" | "select";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  mode?: "multiple";
};

const entityMeta: Record<EntityName, { title: string; singular: string; description: string }> = {
  teachers: { title: "Quản lý giáo viên", singular: "giáo viên", description: "Thông tin và trạng thái chất lượng của đội ngũ." },
  contests: { title: "Quản lý contest", singular: "contest", description: "Phân công giáo viên và theo dõi thời hạn của từng contest Fullhouse." },
};

const statusOptions: Record<EntityName, Array<{ label: string; value: string }>> = {
  teachers: [
    { label: "Đạt yêu cầu", value: "active" },
    { label: "Cần theo dõi", value: "reviewing" },
    { label: "Cần hỗ trợ", value: "warning" },
  ],
  contests: [],
};

function tagColor(status: unknown) {
  if (["active", "completed"].includes(String(status))) return "green";
  if (["reviewing", "scheduled", "upcoming"].includes(String(status))) return "blue";
  if (["warning", "cancelled"].includes(String(status))) return "orange";
  return "default";
}

function contestTiming(startValue: unknown, endValue: unknown, now: number) {
  const start = new Date(String(startValue)).getTime();
  const end = new Date(String(endValue)).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { label: "Chưa xác định", color: "default", remaining: "Thiếu thời gian" };
  }

  const formatRemaining = (milliseconds: number) => {
    const minutes = Math.max(0, Math.ceil(milliseconds / 60_000));
    const days = Math.floor(minutes / 1_440);
    const hours = Math.floor((minutes % 1_440) / 60);
    const remainingMinutes = minutes % 60;
    if (days > 0) return `${days} ngày${hours ? ` ${hours} giờ` : ""}`;
    if (hours > 0) return `${hours} giờ${remainingMinutes ? ` ${remainingMinutes} phút` : ""}`;
    return `${remainingMinutes} phút`;
  };

  if (now < start) return { label: "Sắp diễn ra", color: "blue", remaining: `Bắt đầu sau ${formatRemaining(start - now)}` };
  if (now <= end) return { label: "Đang diễn ra", color: "green", remaining: `Còn ${formatRemaining(end - now)}` };
  return { label: "Đã hết hạn", color: "default", remaining: `Kết thúc ${formatRemaining(now - end)} trước` };
}

function formatDateTime(value: unknown) {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export default function EntityCrud({ entity }: { entity: EntityName }) {
  const { message } = App.useApp();
  const [items, setItems] = useState<EntityRecord[]>([]);
  const [teachers, setTeachers] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [timingFilter, setTimingFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EntityRecord | null>(null);
  const [form] = Form.useForm();
  const meta = entityMeta[entity];

  const fetchEntity = useCallback(async (name: EntityName) => {
    const response = await fetch(`/api/manage/${name}`, { cache: "no-store" });
    const result = (await response.json()) as { items?: EntityRecord[]; error?: string };
    if (!response.ok) throw new Error(result.error ?? "Không thể tải dữ liệu");
    return result.items ?? [];
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [main, teacherList] = await Promise.all([
        fetchEntity(entity),
        entity === "contests" ? fetchEntity("teachers") : Promise.resolve([]),
      ]);
      setItems(main);
      setTeachers(teacherList);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [entity, fetchEntity, message]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (entity !== "contests") return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [entity]);

  const relationName = useCallback((list: EntityRecord[], id: unknown) => {
    if (id === undefined || id === null || id === "") return "—";
    const normalizedId = String(id);
    const match = list.find((item) => String(item.id ?? item.key ?? "") === normalizedId);
    return String(match?.name ?? match?.code ?? "—");
  }, []);

  const relationNames = useCallback((list: EntityRecord[], value: unknown, fallback = "—") => {
    const ids = Array.isArray(value) ? value : value ? [value] : [];
    const names = ids.map((id) => relationName(list, id)).filter((name) => name !== "—");
    return names.length > 0 ? names.join(", ") : fallback;
  }, [relationName]);

  const fields = useMemo<FieldDefinition[]>(() => {
    if (entity === "teachers") return [
      { name: "code", label: "Mã giáo viên", required: true, placeholder: "GV-001" },
      { name: "name", label: "Họ và tên", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "status", label: "Trạng thái", required: true, type: "select", options: statusOptions.teachers },
    ];
    return [
      { name: "code", label: "Mã contest", required: true, placeholder: "cpp62" },
      { name: "name", label: "Tên contest", required: true, placeholder: "Lập trình C++ | Fullhouse Dev 62" },
      { name: "teacherIds", label: "Giáo viên phụ trách", required: true, type: "select", mode: "multiple", options: teachers.map((item) => ({ value: item.id, label: `${item.code ?? "GV"} · ${item.name}` })) },
      { name: "startTime", label: "Bắt đầu", required: true, type: "datetime-local" },
      { name: "endTime", label: "Kết thúc", required: true, type: "datetime-local" },
      { name: "sourceUrl", label: "Đường dẫn contest", placeholder: "https://fullhousedev.com/contest/..." },
      { name: "notes", label: "Ghi chú", type: "textarea" },
    ];
  }, [entity, teachers]);

  const columns = useMemo<TableColumnsType<EntityRecord>>(() => {
    const statusColumn = {
      title: "TRẠNG THÁI", dataIndex: "status", key: "status", width: 130,
      render: (value: unknown) => <Tag color={tagColor(value)}>{statusOptions[entity].find((item) => item.value === value)?.label ?? String(value)}</Tag>,
    };
    const actions = {
      title: "", key: "actions", width: 100, align: "right" as const,
      render: (_: unknown, record: EntityRecord) => <Space>
        <Button type="text" icon={<EditOutlined />} aria-label="Sửa" onClick={() => openEdit(record)} />
        <Popconfirm title={`Xóa ${meta.singular}?`} description="Dữ liệu sau khi xóa không thể khôi phục." okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => remove(record.id)}>
          <Button danger type="text" icon={<DeleteOutlined />} aria-label="Xóa" />
        </Popconfirm>
      </Space>,
    };

    if (entity === "teachers") return [
      { title: "MÃ", dataIndex: "code", key: "code", width: 100 },
      { title: "GIÁO VIÊN", dataIndex: "name", key: "name", render: (value, record) => <div><strong>{String(value)}</strong><small>{String(record.email ?? "Chưa có email")}</small></div> },
      statusColumn, actions,
    ];
    return [
      { title: "CONTEST", dataIndex: "name", key: "name", render: (value, record) => <div><strong>{String(value)}</strong><small>{String(record.code ?? "—")}</small></div> },
      { title: "GIÁO VIÊN", key: "teacherIds", width: 210, render: (_, record) => relationNames(teachers, record.teacherIds ?? record.teacherId, "Chưa phân công") },
      { title: "BẮT ĐẦU", dataIndex: "startTime", key: "startTime", width: 150, render: formatDateTime },
      { title: "KẾT THÚC", dataIndex: "endTime", key: "endTime", width: 150, render: formatDateTime },
      { title: "THỜI HẠN CÒN LẠI", key: "remaining", width: 180, render: (_, record) => { const timing = contestTiming(record.startTime, record.endTime, now); return <div><Tag color={timing.color}>{timing.label}</Tag><small>{timing.remaining}</small></div>; } },
      { title: "LINK", dataIndex: "sourceUrl", key: "sourceUrl", width: 90, render: (value) => value ? <Button type="link" size="small" icon={<LinkOutlined />} href={String(value)} target="_blank" rel="noreferrer">Mở</Button> : <Typography.Text type="secondary">—</Typography.Text> },
      actions,
    ];
  // Functions are stable for the lifetime of this render configuration.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, meta.singular, now, relationNames, teachers]);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      ...(statusOptions[entity][0] ? { status: statusOptions[entity][0].value } : {}),
    });
    setModalOpen(true);
  }

  function openEdit(record: EntityRecord) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  async function save(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const payload = entity === "teachers" && !editing
        ? { ...values, key: String(values.code).toLowerCase(), initials: String(values.name).split(" ").slice(-2).map((part) => part[0]).join("").toUpperCase() }
        : values;
      const response = await fetch(`/api/manage/${entity}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu dữ liệu");
      message.success(result.message ?? "Đã lưu dữ liệu");
      setModalOpen(false);
      await loadData();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const response = await fetch(`/api/manage/${entity}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể xóa dữ liệu");
      message.success(result.message ?? "Đã xóa dữ liệu");
      await loadData();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể xóa dữ liệu");
    }
  }

  const filtered = items.filter((item) => {
    if (!JSON.stringify(item).toLowerCase().includes(search.toLowerCase())) return false;
    if (entity !== "contests") return true;

    const teacherIds = Array.isArray(item.teacherIds)
      ? item.teacherIds.map(String)
      : item.teacherId ? [String(item.teacherId)] : [];
    const realTeacherIds = teacherIds.filter((id) => {
      const teacher = teachers.find((candidate) => String(candidate.id) === id);
      return teacher && teacher.isPlaceholder !== true;
    });
    const assigned = realTeacherIds.length > 0;
    if (teacherFilter !== "all" && !realTeacherIds.includes(teacherFilter)) return false;
    if (assignmentFilter === "assigned" && !assigned) return false;
    if (assignmentFilter === "unassigned" && assigned) return false;

    if (timingFilter !== "all") {
      const start = new Date(String(item.startTime)).getTime();
      const end = new Date(String(item.endTime)).getTime();
      const timing = !Number.isFinite(start) || !Number.isFinite(end)
        ? "unknown"
        : now < start ? "upcoming" : now <= end ? "ongoing" : "expired";
      if (timing !== timingFilter) return false;
    }
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div><Typography.Title level={2}>{meta.title}</Typography.Title><Typography.Text>{meta.description}</Typography.Text></div>
        <Space><Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm {meta.singular}</Button></Space>
      </div>
      <Card className={styles.card}>
        <div className={styles.toolbar}>
          <Input allowClear prefix={<SearchOutlined />} placeholder={`Tìm ${meta.singular}...`} value={search} onChange={(event) => setSearch(event.target.value)} />
          {entity === "contests" && <>
            <Select
              value={teacherFilter}
              onChange={setTeacherFilter}
              options={[
                { value: "all", label: "Tất cả giáo viên" },
                ...teachers.filter((item) => item.isPlaceholder !== true).map((item) => ({ value: item.id, label: String(item.name) })),
              ]}
            />
            <Select value={timingFilter} onChange={setTimingFilter} options={[
              { value: "all", label: "Tất cả thời hạn" },
              { value: "ongoing", label: "Đang diễn ra" },
              { value: "upcoming", label: "Sắp diễn ra" },
              { value: "expired", label: "Đã hết hạn" },
              { value: "unknown", label: "Thiếu thời gian" },
            ]} />
            <Select value={assignmentFilter} onChange={setAssignmentFilter} options={[
              { value: "all", label: "Tất cả phân công" },
              { value: "assigned", label: "Đã phân công" },
              { value: "unassigned", label: "Chưa phân công" },
            ]} />
          </>}
          <Typography.Text>{filtered.length} bản ghi</Typography.Text>
        </div>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={filtered} scroll={{ x: 850 }} pagination={{ pageSize: 8, showSizeChanger: false }} />
      </Card>

      <Modal title={`${editing ? "Cập nhật" : "Thêm"} ${meta.singular}`} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editing ? "Cập nhật" : "Tạo mới"} cancelText="Hủy" confirmLoading={saving} width={620} destroyOnHidden>
        <Form form={form} layout="vertical" onFinish={save} className={styles.form}>
          {fields.map((field) => <Form.Item key={field.name} name={field.name} label={field.label} rules={field.required ? [{ required: true, message: `Vui lòng nhập ${field.label.toLowerCase()}` }] : undefined}>
            {field.type === "select" ? <Select mode={field.mode} showSearch optionFilterProp="label" placeholder={field.placeholder ?? `Chọn ${field.label.toLowerCase()}`} options={field.options} />
              : field.type === "textarea" ? <Input.TextArea rows={3} maxLength={500} showCount />
              : <Input type={field.type === "datetime-local" ? field.type : "text"} placeholder={field.placeholder} />}
          </Form.Item>)}
        </Form>
      </Modal>
    </div>
  );
}
