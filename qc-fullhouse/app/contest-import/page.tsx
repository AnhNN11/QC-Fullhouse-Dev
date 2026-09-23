"use client";

import { Alert, Button, Card, Input, Space, Typography } from "antd";
import { useState } from "react";

export default function ContestImportPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const items = JSON.parse(value) as unknown;
      const response = await fetch("/api/contests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await response.json()) as { error?: string; message?: string; assigned?: number; unassigned?: number };
      if (!response.ok) throw new Error(data.error ?? "Import thất bại");
      setResult({ type: "success", message: `${data.message} Đã khớp giáo viên: ${data.assigned}; chưa phân công: ${data.unassigned}.` });
    } catch (error) {
      setResult({ type: "error", message: error instanceof Error ? error.message : "Dữ liệu JSON không hợp lệ." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 920, margin: "48px auto", padding: "0 20px" }}>
      <Card>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <div>
            <Typography.Title level={2}>Import contest FullHouseDev</Typography.Title>
            <Typography.Text type="secondary">Dán mảng JSON đã xuất từ trang quản trị FullHouseDev. Contest được cập nhật theo mã, không tạo bản ghi trùng.</Typography.Text>
          </div>
          {result && <Alert type={result.type} showIcon message={result.message} />}
          <Input.TextArea aria-label="Dữ liệu contest JSON" value={value} onChange={(event) => setValue(event.target.value)} rows={18} placeholder='[{"code":"cpp62", ...}]' />
          <Space>
            <Button type="primary" loading={loading} disabled={!value.trim()} onClick={() => void submit()}>Import dữ liệu</Button>
            <Button href="/">Quay lại hệ thống</Button>
          </Space>
        </Space>
      </Card>
    </main>
  );
}
