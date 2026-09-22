"use client";

import { App, Button, Card, Col, Empty, Form, Input, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { CopyOutlined, FileDoneOutlined, PlayCircleOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./daily-report.module.css";

type ReportSession = {
  id: string;
  classCode: string;
  className: string;
  teacherName: string;
  sessionNo: number;
  startTime: string;
  endTime: string;
  topic: string;
  recordingUrl?: string;
  recordingStatus: "pending_upload" | "ready" | "reviewed" | "issue";
  qcNote?: string;
};

type ReportForm = {
  summary: string;
  highlights?: string;
  issues?: string;
  nextActions?: string;
};

const statusLabel: Record<ReportSession["recordingStatus"], string> = {
  pending_upload: "Chờ tải record",
  ready: "Chờ QC kiểm tra",
  reviewed: "Đã kiểm tra",
  issue: "Record có vấn đề",
};

export default function DailyReport() {
  const { message } = App.useApp();
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }));
  const [sessions, setSessions] = useState<ReportSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<ReportForm>();

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/daily-reports?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      const result = (await response.json()) as { sessions?: ReportSession[]; report?: ReportForm; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể tải báo cáo");
      const rows = result.sessions ?? [];
      setSessions(rows);
      const reviewed = rows.filter((item) => item.recordingStatus === "reviewed").length;
      const issues = rows.filter((item) => item.recordingStatus === "issue").length;
      const liveSummary = `Ngày ${date}: có ${rows.length} buổi học, QC đã kiểm tra ${reviewed}/${rows.length} record${issues ? `, phát hiện ${issues} record có vấn đề` : ""}.`;
      const liveIssues = rows.filter((item) => item.recordingStatus === "issue").map((item) => `- ${item.classCode} · ${item.teacherName}: ${item.qcNote || "Cần kiểm tra lại"}`).join("\n");
      form.setFieldsValue({
        ...result.report,
        summary: liveSummary,
        highlights: result.report?.highlights ?? "",
        issues: liveIssues,
        nextActions: result.report?.nextActions ?? "",
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  }, [date, form, message]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadReport(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReport]);

  const counts = useMemo(() => ({
    reviewed: sessions.filter((item) => item.recordingStatus === "reviewed").length,
    waiting: sessions.filter((item) => item.recordingStatus === "ready").length,
    issues: sessions.filter((item) => item.recordingStatus === "issue").length,
  }), [sessions]);

  const columns: TableColumnsType<ReportSession> = [
    { title: "LỚP", dataIndex: "classCode", key: "classCode", render: (_, row) => <div><strong>{row.classCode}</strong><small>{row.className}</small></div> },
    { title: "GIÁO VIÊN", dataIndex: "teacherName", key: "teacherName" },
    { title: "BUỔI", dataIndex: "sessionNo", key: "sessionNo", width: 70, align: "center" },
    { title: "THỜI GIAN", key: "time", render: (_, row) => `${row.startTime}–${row.endTime}` },
    { title: "TRẠNG THÁI QC", dataIndex: "recordingStatus", key: "recordingStatus", render: (value: ReportSession["recordingStatus"]) => <Tag color={value === "reviewed" ? "green" : value === "issue" ? "red" : value === "ready" ? "blue" : "default"}>{statusLabel[value]}</Tag> },
    { title: "RECORD", dataIndex: "recordingUrl", key: "recordingUrl", render: (value) => value ? <Button type="link" icon={<PlayCircleOutlined />} href={String(value)} target="_blank">Mở record</Button> : <Typography.Text type="secondary">Chưa có</Typography.Text> },
  ];

  async function saveReport(values: ReportForm) {
    setSaving(true);
    try {
      const response = await fetch("/api/daily-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, ...values }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu báo cáo");
      message.success(result.message ?? "Đã lưu Daily Report");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể lưu báo cáo");
    } finally {
      setSaving(false);
    }
  }

  async function copyReport() {
    const values = form.getFieldsValue();
    const text = [`DAILY QC REPORT · ${date}`, "", values.summary, "", "Điểm nổi bật:", values.highlights || "- Không có", "", "Vấn đề:", values.issues || "- Không có", "", "Hành động tiếp theo:", values.nextActions || "- Không có"].join("\n");
    await navigator.clipboard.writeText(text);
    message.success("Đã sao chép báo cáo để gửi cho quản lý");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div><Typography.Title level={2}>Daily QC Report</Typography.Title><Typography.Text>Tổng hợp kết quả kiểm tra record từng lớp để báo cáo quản lý.</Typography.Text></div>
        <Space wrap><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /><Button icon={<ReloadOutlined />} onClick={loadReport}>Làm mới</Button></Space>
      </div>

      <Row gutter={[16, 16]} className={styles.stats}>
        <Col xs={12} lg={6}><Card><Statistic title="Buổi học" value={sessions.length} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Đã kiểm tra" value={counts.reviewed} styles={{ content: { color: "#0d9e69" } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Chờ kiểm tra" value={counts.waiting} styles={{ content: { color: "#2f6fed" } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="Có vấn đề" value={counts.issues} styles={{ content: { color: "#d94f4f" } }} /></Card></Col>
      </Row>

      <Card className={styles.card} title="Record theo buổi học" extra={<FileDoneOutlined />}>
        {sessions.length || loading ? <Table rowKey="id" loading={loading} columns={columns} dataSource={sessions} pagination={false} scroll={{ x: 780 }} /> : <Empty description="Không có buổi học trong ngày đã chọn" />}
      </Card>

      <Card className={styles.card} title="Nội dung gửi quản lý">
        <Form form={form} layout="vertical" onFinish={saveReport}>
          <Form.Item name="summary" label="Tổng quan" rules={[{ required: true, message: "Vui lòng nhập nội dung tổng quan" }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="highlights" label="Điểm nổi bật"><Input.TextArea rows={3} placeholder="Các giáo viên hoặc buổi học có chất lượng tốt..." /></Form.Item>
          <Form.Item name="issues" label="Vấn đề cần lưu ý"><Input.TextArea rows={3} placeholder="Record lỗi, lớp có vấn đề hoặc nội dung cần coaching..." /></Form.Item>
          <Form.Item name="nextActions" label="Hành động tiếp theo"><Input.TextArea rows={3} placeholder="Coaching giáo viên, yêu cầu bổ sung record, theo dõi lại..." /></Form.Item>
          <Space><Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>Lưu Daily Report</Button><Button icon={<CopyOutlined />} onClick={copyReport}>Sao chép để gửi sếp</Button></Space>
        </Form>
      </Card>
    </div>
  );
}
