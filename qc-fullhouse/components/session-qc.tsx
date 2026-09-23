"use client";

import {
  Alert,
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  CloudDownloadOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styles from "./session-qc.module.css";

type QcSession = {
  id: string;
  contestCode: string;
  contestName: string;
  teacherNames?: string[];
  sessionNo: number;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  sourceUrl: string;
  recordingUrl?: string;
  recordingCount: number;
  recordingStatus: "pending_upload" | "ready" | "reviewed" | "issue";
  qcScore?: number;
  qcNote?: string;
};

type Stats = { total: number; waiting: number; reviewed: number; issues: number };
type Pagination = { page: number; pageSize: number; total: number };

const statusMeta = {
  pending_upload: { label: "Chưa có record", color: "default" },
  ready: { label: "Chờ QC", color: "blue" },
  reviewed: { label: "Đã QC", color: "green" },
  issue: { label: "Có vấn đề", color: "red" },
} as const;

function vietnamDate(offsetDays = 0) {
  const shifted = new Date(Date.now() + offsetDays * 86_400_000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(shifted);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isFullhouseDomain(value: unknown) {
  const domain = String(value ?? "").trim().replace(/^\./, "").toLowerCase();
  return domain === "fullhousedev.com" || domain.endsWith(".fullhousedev.com");
}

function cookiesFromFile(text: string) {
  const trimmed = text.trim();
  try {
    const parsed = JSON.parse(trimmed) as Array<{ domain?: string; name?: string; value?: string }> | { cookies?: Array<{ domain?: string; name?: string; value?: string }> };
    const rows = Array.isArray(parsed) ? parsed : parsed.cookies;
    if (Array.isArray(rows)) {
      const cookie = rows
        .filter((item) => isFullhouseDomain(item.domain) && item.name)
        .map((item) => `${item.name}=${item.value ?? ""}`)
        .join("; ");
      if (cookie) return cookie;
    }
  } catch {
    // Continue with Netscape or raw Cookie formats.
  }

  const netscapeCookie = trimmed.split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("\t"))
    .filter((parts) => parts.length >= 7 && isFullhouseDomain(parts[0]))
    .map((parts) => `${parts[5]}=${parts[6]}`)
    .join("; ");
  if (netscapeCookie) return netscapeCookie;
  const rawCookie = trimmed.replace(/^Cookie:\s*/i, "");
  if (/(^|;\s*)sessionid=/.test(rawCookie)) return rawCookie;
  throw new Error("File không có cookie sessionid của fullhousedev.com.");
}

export default function SessionQc() {
  const { message } = App.useApp();
  const [items, setItems] = useState<QcSession[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, waiting: 0, reviewed: 0, issues: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState(() => vietnamDate(-1));
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 50, total: 0 });
  const [selected, setSelected] = useState<QcSession | null>(null);
  const [crawlOpen, setCrawlOpen] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [form] = Form.useForm();
  const [crawlForm] = Form.useForm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      params.set("date", date);
      params.set("hasRecording", "true");
      params.set("page", String(page));
      params.set("pageSize", "50");
      const response = await fetch(`/api/qc-sessions?${params}`, { cache: "no-store" });
      const result = (await response.json()) as { items?: QcSession[]; stats?: Stats; pagination?: Pagination; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể tải buổi học");
      setItems(result.items ?? []);
      setStats(result.stats ?? { total: 0, waiting: 0, reviewed: 0, issues: 0 });
      setPagination(result.pagination ?? { page, pageSize: 50, total: 0 });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể tải buổi học");
    } finally {
      setLoading(false);
    }
  }, [date, message, page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 250);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const columns = useMemo<TableColumnsType<QcSession>>(() => [
    {
      title: "BUỔI HỌC",
      key: "session",
      render: (_, row) => <div className={styles.primaryCell}><strong>{row.contestName}</strong><span>{row.contestCode} · Buổi {row.sessionNo}</span></div>,
    },
    { title: "GIÁO VIÊN", key: "teachers", width: 180, render: (_, row) => row.teacherNames?.join(", ") || "Chưa phân công" },
    { title: "NGÀY", dataIndex: "date", key: "date", width: 110 },
    { title: "THỜI GIAN", key: "time", width: 120, render: (_, row) => `${row.startTime}–${row.endTime}` },
    { title: "NỘI DUNG", dataIndex: "topic", key: "topic", render: (value) => String(value || "Chưa có nội dung") },
    {
      title: "RECORD",
      key: "recording",
      width: 115,
      render: (_, row) => row.recordingCount > 0
        ? <Button type="link" size="small" icon={<PlayCircleOutlined />} href={row.recordingUrl} target="_blank">Xem ({row.recordingCount})</Button>
        : <Typography.Text type="secondary">Chưa có</Typography.Text>,
    },
    {
      title: "TRẠNG THÁI QC",
      dataIndex: "recordingStatus",
      key: "recordingStatus",
      width: 130,
      render: (value: QcSession["recordingStatus"]) => <Tag color={statusMeta[value]?.color}>{statusMeta[value]?.label ?? value}</Tag>,
    },
    {
      title: "NHẬN XÉT QC",
      key: "qcNote",
      width: 230,
      render: (_, row) => row.qcScore !== undefined || row.qcNote
        ? <div className={styles.qcComment}>{row.qcScore !== undefined && <Tag color="geekblue">{row.qcScore}/100</Tag>}<span>{row.qcNote || "Đã kiểm tra, chưa có ghi chú"}</span></div>
        : <Typography.Text type="secondary">Chưa nhận xét</Typography.Text>,
    },
    {
      title: "",
      key: "action",
      width: 105,
      render: (_, row) => <Button
        type={row.recordingStatus === "ready" ? "primary" : "default"}
        disabled={!row.recordingCount}
        onClick={() => {
          setSelected(row);
          form.setFieldsValue({ score: row.qcScore ?? 90, outcome: row.recordingStatus === "issue" ? "issue" : "reviewed", note: row.qcNote ?? "" });
        }}
      >{row.recordingStatus === "ready" ? "QC ngay" : "Sửa QC"}</Button>,
    },
  ], [form]);

  async function submitEvaluation(values: { score: number; outcome: "reviewed" | "issue"; note?: string }) {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selected.id, ...values }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu đánh giá");
      message.success(result.message ?? "Đã lưu đánh giá");
      setSelected(null);
      await loadData();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể lưu đánh giá");
    } finally {
      setSaving(false);
    }
  }

  async function runLocalCrawl(values: { cookie: string; contestCode?: string }) {
    setCrawling(true);
    try {
      const response = await fetch("/api/local-crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể chạy crawler");
      message.success(result.message ?? "Đã crawl xong");
      crawlForm.resetFields();
      setCrawlOpen(false);
      await loadData();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể chạy crawler", 8);
    } finally {
      setCrawling(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div><Typography.Title level={2}>QC buổi học hằng ngày</Typography.Title><Typography.Text>Mặc định hiển thị toàn bộ record của ngày hôm qua để bạn xem và nhận xét lần lượt.</Typography.Text></div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button>
          <Button type="primary" icon={<CloudDownloadOutlined />} onClick={() => setCrawlOpen(true)}>Crawl buổi học</Button>
        </Space>
      </div>

      <Alert
        className={styles.crawlHint}
        type="info"
        showIcon
        icon={<CodeOutlined />}
        title="Crawler chỉ hoạt động trên máy local"
        description="Bấm Crawl buổi học, tải file cookies.txt/JSON hoặc dán cookie của phiên đăng nhập Fullhouse. Cookie chỉ được dùng cho lần chạy này, không lưu vào MongoDB."
      />

      <Row gutter={[14, 14]} className={styles.stats}>
        <Col xs={12} lg={6}><Card><Statistic title={`Buổi có record · ${dayjs(date).format("DD/MM")}`} value={stats.total} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Chờ QC" value={stats.waiting} prefix={<ClockCircleOutlined />} styles={{ content: { color: "#2f6fed" } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Đã QC" value={stats.reviewed} prefix={<CheckCircleOutlined />} styles={{ content: { color: "#0d9e69" } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Có vấn đề" value={stats.issues} prefix={<ExclamationCircleOutlined />} styles={{ content: { color: "#d94f4f" } }} /></Card></Col>
      </Row>

      <Card className={styles.card}>
        <div className={styles.toolbar}>
          <DatePicker
            allowClear={false}
            value={dayjs(date)}
            format="DD/MM/YYYY"
            onChange={(value) => {
              if (!value) return;
              setDate(value.format("YYYY-MM-DD"));
              setPage(1);
            }}
          />
          <Button onClick={() => { setDate(vietnamDate(-1)); setPage(1); }}>Hôm qua</Button>
          <Input allowClear prefix={<SearchOutlined />} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm contest, giáo viên hoặc nội dung..." />
          <Select value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "ready", label: "Chờ QC" },
            { value: "reviewed", label: "Đã QC" },
            { value: "issue", label: "Có vấn đề" },
          ]} />
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
            showTotal: (total) => `${total} buổi`,
            onChange: setPage,
          }}
          scroll={{ x: 1320 }}
        />
      </Card>

      <Modal
        title={selected ? `QC ${selected.contestCode} · Buổi ${selected.sessionNo}` : "QC buổi học"}
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        onOk={() => form.submit()}
        okText="Lưu đánh giá"
        cancelText="Hủy"
        confirmLoading={saving}
        destroyOnHidden
        forceRender
      >
        {selected && <Space orientation="vertical" className={styles.modalSummary} size={2}>
          <Typography.Text strong>{selected.contestName}</Typography.Text>
          <Typography.Text type="secondary">{selected.date} · {selected.startTime}–{selected.endTime} · {selected.teacherNames?.join(", ") || "Chưa phân công"}</Typography.Text>
          <Button type="link" icon={<PlayCircleOutlined />} href={selected.recordingUrl} target="_blank">Mở recording để kiểm tra</Button>
        </Space>}
        <Form form={form} layout="vertical" onFinish={submitEvaluation}>
          <Form.Item name="score" label="Điểm QC" rules={[{ required: true, message: "Vui lòng nhập điểm" }]}><InputNumber min={0} max={100} style={{ width: "100%" }} suffix="/ 100" /></Form.Item>
          <Form.Item name="outcome" label="Kết quả" rules={[{ required: true }]}><Select options={[{ value: "reviewed", label: "Đạt / đã kiểm tra" }, { value: "issue", label: "Có vấn đề cần xử lý" }]} /></Form.Item>
          <Form.Item
            name="note"
            label="Nhận xét QC"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("outcome") !== "issue" || String(value ?? "").trim()) return Promise.resolve();
                  return Promise.reject(new Error("Vui lòng mô tả vấn đề cần xử lý"));
                },
              }),
            ]}
          >
            <Input.TextArea rows={5} maxLength={1000} showCount placeholder="Điểm làm tốt, vấn đề và đề xuất cải thiện..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Crawl buổi học từ Fullhouse"
        open={crawlOpen}
        onCancel={() => { if (!crawling) { crawlForm.resetFields(); setCrawlOpen(false); } }}
        onOk={() => crawlForm.submit()}
        okText="Bắt đầu crawl"
        cancelText="Hủy"
        confirmLoading={crawling}
        cancelButtonProps={{ disabled: crawling }}
        closable={!crawling}
        mask={{ closable: !crawling }}
        destroyOnHidden
        forceRender
      >
        <Alert
          type="warning"
          showIcon
          title="Cookie là thông tin đăng nhập nhạy cảm"
          description="Chỉ nhập trên localhost. Hệ thống không lưu cookie sau khi crawler kết thúc."
          className={styles.modalAlert}
        />
        <Form form={crawlForm} layout="vertical" onFinish={runLocalCrawl} preserve={false}>
          <Form.Item label="Tải file cookie">
            <Upload
              accept=".txt,.json"
              maxCount={1}
              showUploadList={false}
              beforeUpload={async (file) => {
                try {
                  const cookie = cookiesFromFile(await file.text());
                  crawlForm.setFieldValue("cookie", cookie);
                  message.success("Đã đọc cookie Fullhouse từ file");
                } catch (error) {
                  message.error(error instanceof Error ? error.message : "Không đọc được file cookie");
                }
                return Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn cookies.txt hoặc JSON</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="cookie"
            label="Cookie phiên Fullhouse"
            rules={[{ required: true, message: "Hãy dán cookie có sessionid" }]}
            extra="Dán toàn bộ giá trị Cookie của một request đang đăng nhập trên fullhousedev.com."
          >
            <Input.Password autoComplete="off" placeholder="sessionid=...; csrftoken=..." />
          </Form.Item>
          <Form.Item name="contestCode" label="Mã contest (không bắt buộc)" extra="Để trống để crawl tất cả contest trong MongoDB.">
            <Input placeholder="Ví dụ: pynhatanh1on1062026" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
