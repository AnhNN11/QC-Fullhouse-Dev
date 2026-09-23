"use client";

import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
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
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./entity-crud.module.css";

type EntityName = "teachers" | "courses" | "classes" | "sessions" | "contests";
type EntityRecord = Record<string, unknown> & { id: string };

type FieldDefinition = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "number" | "textarea" | "date" | "time" | "datetime-local" | "select";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
};

const entityMeta: Record<EntityName, { title: string; singular: string; description: string }> = {
  teachers: { title: "Quản lý giáo viên", singular: "giáo viên", description: "Thông tin chuyên môn và trạng thái chất lượng của đội ngũ." },
  courses: { title: "Quản lý khóa học", singular: "khóa học", description: "Danh mục chương trình và lộ trình đào tạo Fullhouse." },
  classes: { title: "Quản lý lớp học", singular: "lớp học", description: "Phân công giáo viên, lịch học và quy mô từng lớp." },
  sessions: { title: "Buổi học & record", singular: "buổi học", description: "Quản lý record và kết quả QC của từng buổi trong mỗi lớp." },
  contests: { title: "Quản lý contest", singular: "contest", description: "Phân công giáo viên và theo dõi thời hạn của từng contest Fullhouse." },
};

const statusOptions: Record<EntityName, Array<{ label: string; value: string }>> = {
  teachers: [
    { label: "Đạt yêu cầu", value: "active" },
    { label: "Cần theo dõi", value: "reviewing" },
    { label: "Cần hỗ trợ", value: "warning" },
  ],
  courses: [
    { label: "Đang tuyển sinh", value: "active" },
    { label: "Bản nháp", value: "draft" },
    { label: "Đã lưu trữ", value: "archived" },
  ],
  classes: [
    { label: "Đang học", value: "active" },
    { label: "Sắp khai giảng", value: "upcoming" },
    { label: "Đã kết thúc", value: "completed" },
  ],
  sessions: [
    { label: "Đã lên lịch", value: "scheduled" },
    { label: "Đã hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
  ],
  contests: [],
};

const recordingStatusOptions = [
  { label: "Chờ tải record", value: "pending_upload" },
  { label: "Chờ QC kiểm tra", value: "ready" },
  { label: "Đã kiểm tra", value: "reviewed" },
  { label: "Record có vấn đề", value: "issue" },
];

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
  const [courses, setCourses] = useState<EntityRecord[]>([]);
  const [classes, setClasses] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [search, setSearch] = useState("");
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
      const [main, teacherList, courseList, classList] = await Promise.all([
        fetchEntity(entity),
        ["classes", "contests"].includes(entity) ? fetchEntity("teachers") : Promise.resolve([]),
        entity === "classes" ? fetchEntity("courses") : Promise.resolve([]),
        entity === "sessions" ? fetchEntity("classes") : Promise.resolve([]),
      ]);
      setItems(main);
      setTeachers(teacherList);
      setCourses(courseList);
      setClasses(classList);
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
    const match = list.find((item) => item.id === id || item.key === id);
    return String(match?.name ?? match?.code ?? id ?? "—");
  }, []);

  const fields = useMemo<FieldDefinition[]>(() => {
    if (entity === "teachers") return [
      { name: "code", label: "Mã giáo viên", required: true, placeholder: "GV-001" },
      { name: "name", label: "Họ và tên", required: true },
      { name: "subject", label: "Chuyên môn", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Số điện thoại", type: "text" },
      { name: "status", label: "Trạng thái", required: true, type: "select", options: statusOptions.teachers },
    ];
    if (entity === "courses") return [
      { name: "code", label: "Mã khóa học", required: true, placeholder: "KH-EF1" },
      { name: "name", label: "Tên khóa học", required: true },
      { name: "level", label: "Trình độ", required: true, placeholder: "Foundation / IELTS / Junior" },
      { name: "durationWeeks", label: "Thời lượng (tuần)", required: true, type: "number", min: 1, max: 104 },
      { name: "description", label: "Mô tả", type: "textarea" },
      { name: "status", label: "Trạng thái", required: true, type: "select", options: statusOptions.courses },
    ];
    if (entity === "classes") return [
      { name: "code", label: "Mã lớp", required: true, placeholder: "FH-EF1-0426" },
      { name: "name", label: "Tên lớp", required: true },
      { name: "courseId", label: "Khóa học", required: true, type: "select", options: courses.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` })) },
      { name: "teacherId", label: "Giáo viên phụ trách", required: true, type: "select", options: teachers.map((item) => ({ value: item.id, label: `${item.code ?? "GV"} · ${item.name}` })) },
      { name: "startDate", label: "Ngày khai giảng", required: true, type: "date" },
      { name: "schedule", label: "Lịch học", required: true, placeholder: "Thứ 2, 4 · 18:00–19:30" },
      { name: "room", label: "Phòng học" },
      { name: "studentCount", label: "Số học viên", type: "number", min: 0, max: 100 },
      { name: "status", label: "Trạng thái", required: true, type: "select", options: statusOptions.classes },
    ];
    if (entity === "contests") return [
      { name: "code", label: "Mã contest", required: true, placeholder: "cpp62" },
      { name: "name", label: "Tên contest", required: true, placeholder: "Lập trình C++ | Fullhouse Dev 62" },
      { name: "teacherId", label: "Giáo viên phụ trách", required: true, type: "select", options: teachers.map((item) => ({ value: item.id, label: `${item.code ?? "GV"} · ${item.name}` })) },
      { name: "startTime", label: "Bắt đầu", required: true, type: "datetime-local" },
      { name: "endTime", label: "Kết thúc", required: true, type: "datetime-local" },
      { name: "sourceUrl", label: "Đường dẫn contest", placeholder: "https://fullhousedev.com/contest/..." },
      { name: "notes", label: "Ghi chú", type: "textarea" },
    ];
    return [
      { name: "classId", label: "Lớp học", required: true, type: "select", options: classes.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` })) },
      { name: "sessionNo", label: "Số buổi", required: true, type: "number", min: 1, max: 500 },
      { name: "date", label: "Ngày học", required: true, type: "date" },
      { name: "startTime", label: "Giờ bắt đầu", required: true, type: "time" },
      { name: "endTime", label: "Giờ kết thúc", required: true, type: "time" },
      { name: "topic", label: "Nội dung buổi học", required: true },
      { name: "note", label: "Ghi chú", type: "textarea" },
      { name: "recordingUrl", label: "Đường dẫn record", placeholder: "https://drive.google.com/..." },
      { name: "recordingStatus", label: "Trạng thái record", required: true, type: "select", options: recordingStatusOptions },
      { name: "qcNote", label: "Nhận xét của QC", type: "textarea" },
      { name: "status", label: "Trạng thái", required: true, type: "select", options: statusOptions.sessions },
    ];
  }, [classes, courses, entity, teachers]);

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
      { title: "CHUYÊN MÔN", dataIndex: "subject", key: "subject" },
      { title: "ĐIỆN THOẠI", dataIndex: "phone", key: "phone", render: (value) => String(value ?? "—") },
      statusColumn, actions,
    ];
    if (entity === "courses") return [
      { title: "MÃ", dataIndex: "code", key: "code", width: 110 },
      { title: "KHÓA HỌC", dataIndex: "name", key: "name", render: (value, record) => <div><strong>{String(value)}</strong><small>{String(record.description ?? "")}</small></div> },
      { title: "TRÌNH ĐỘ", dataIndex: "level", key: "level" },
      { title: "THỜI LƯỢNG", dataIndex: "durationWeeks", key: "durationWeeks", render: (value) => `${String(value)} tuần` },
      statusColumn, actions,
    ];
    if (entity === "classes") return [
      { title: "MÃ LỚP", dataIndex: "code", key: "code", width: 120 },
      { title: "LỚP HỌC", dataIndex: "name", key: "name", render: (value, record) => <div><strong>{String(value)}</strong><small>{relationName(courses, record.courseId)}</small></div> },
      { title: "GIÁO VIÊN", dataIndex: "teacherId", key: "teacherId", render: (value) => relationName(teachers, value) },
      { title: "LỊCH HỌC", dataIndex: "schedule", key: "schedule" },
      { title: "HỌC VIÊN", dataIndex: "studentCount", key: "studentCount", align: "center" },
      statusColumn, actions,
    ];
    if (entity === "contests") return [
      { title: "CONTEST", dataIndex: "name", key: "name", render: (value, record) => <div><strong>{String(value)}</strong><small>{String(record.code ?? "—")}</small></div> },
      { title: "GIÁO VIÊN", dataIndex: "teacherId", key: "teacherId", width: 180, render: (value) => relationName(teachers, value) },
      { title: "BẮT ĐẦU", dataIndex: "startTime", key: "startTime", width: 150, render: formatDateTime },
      { title: "KẾT THÚC", dataIndex: "endTime", key: "endTime", width: 150, render: formatDateTime },
      { title: "THỜI HẠN CÒN LẠI", key: "remaining", width: 180, render: (_, record) => { const timing = contestTiming(record.startTime, record.endTime, now); return <div><Tag color={timing.color}>{timing.label}</Tag><small>{timing.remaining}</small></div>; } },
      { title: "LINK", dataIndex: "sourceUrl", key: "sourceUrl", width: 90, render: (value) => value ? <Button type="link" size="small" icon={<LinkOutlined />} href={String(value)} target="_blank" rel="noreferrer">Mở</Button> : <Typography.Text type="secondary">—</Typography.Text> },
      actions,
    ];
    return [
      { title: "LỚP HỌC", dataIndex: "classId", key: "classId", render: (value) => relationName(classes, value) },
      { title: "BUỔI", dataIndex: "sessionNo", key: "sessionNo", width: 75, align: "center" },
      { title: "NGÀY", dataIndex: "date", key: "date", width: 115 },
      { title: "THỜI GIAN", key: "time", render: (_, record) => `${record.startTime}–${record.endTime}` },
      { title: "NỘI DUNG", dataIndex: "topic", key: "topic" },
      { title: "RECORD", dataIndex: "recordingUrl", key: "recordingUrl", width: 115, render: (value) => value ? <Button type="link" size="small" icon={<PlayCircleOutlined />} href={String(value)} target="_blank" rel="noreferrer">Xem record</Button> : <Typography.Text type="secondary">Chưa có</Typography.Text> },
      { title: "QC RECORD", dataIndex: "recordingStatus", key: "recordingStatus", width: 145, render: (value) => <Tag color={value === "reviewed" ? "green" : value === "issue" ? "red" : value === "ready" ? "blue" : "default"}>{recordingStatusOptions.find((item) => item.value === value)?.label ?? String(value)}</Tag> },
      statusColumn, actions,
    ];
  // Functions are stable for the lifetime of this render configuration.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, courses, entity, meta.singular, now, teachers]);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      ...(statusOptions[entity][0] ? { status: statusOptions[entity][0].value } : {}),
      ...(entity === "sessions" ? { recordingStatus: "pending_upload" } : {}),
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

  const filtered = items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div><Typography.Title level={2}>{meta.title}</Typography.Title><Typography.Text>{meta.description}</Typography.Text></div>
        <Space><Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button><Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm {meta.singular}</Button></Space>
      </div>
      <Card className={styles.card}>
        <div className={styles.toolbar}><Input allowClear prefix={<SearchOutlined />} placeholder={`Tìm ${meta.singular}...`} value={search} onChange={(event) => setSearch(event.target.value)} /><Typography.Text>{filtered.length} bản ghi</Typography.Text></div>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={filtered} scroll={{ x: 850 }} pagination={{ pageSize: 8, showSizeChanger: false }} />
      </Card>

      <Modal title={`${editing ? "Cập nhật" : "Thêm"} ${meta.singular}`} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editing ? "Cập nhật" : "Tạo mới"} cancelText="Hủy" confirmLoading={saving} width={620} destroyOnHidden>
        <Form form={form} layout="vertical" onFinish={save} className={styles.form}>
          {fields.map((field) => <Form.Item key={field.name} name={field.name} label={field.label} rules={field.required ? [{ required: true, message: `Vui lòng nhập ${field.label.toLowerCase()}` }] : undefined}>
            {field.type === "select" ? <Select showSearch optionFilterProp="label" placeholder={field.placeholder ?? `Chọn ${field.label.toLowerCase()}`} options={field.options} />
              : field.type === "number" ? <InputNumber min={field.min} max={field.max} style={{ width: "100%" }} />
              : field.type === "textarea" ? <Input.TextArea rows={3} maxLength={500} showCount />
              : <Input type={["date", "time", "datetime-local"].includes(field.type ?? "") ? field.type : "text"} placeholder={field.placeholder} />}
          </Form.Item>)}
        </Form>
      </Modal>
    </div>
  );
}
