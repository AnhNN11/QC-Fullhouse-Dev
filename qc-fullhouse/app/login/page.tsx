"use client";

import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Card, ConfigProvider, Form, Input, Typography } from "antd";
import viVN from "antd/locale/vi_VN";
import styles from "./login.module.css";

const { Text, Title } = Typography;

type LoginValues = {
  username: string;
  password: string;
};

function LoginForm() {
  const { message } = App.useApp();

  async function submit(values: LoginValues) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      message.error(result.error ?? "Không thể đăng nhập.");
      return;
    }

    const requestedPath = new URLSearchParams(window.location.search).get("next");
    window.location.href = requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/";
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <Card className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>F</div>
          <div><strong>FULLHOUSE</strong><span>EDUCATION</span></div>
        </div>
        <div className={styles.heading}>
          <div className={styles.securityIcon}><SafetyCertificateOutlined /></div>
          <Title level={2}>Đăng nhập QC</Title>
          <Text>Truy cập hệ thống quản lý chất lượng giảng dạy.</Text>
        </div>
        <Form<LoginValues> layout="vertical" onFinish={submit} requiredMark={false} size="large">
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}>
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" autoComplete="current-password" />
          </Form.Item>
          <Form.Item className={styles.submitItem}>
            <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
          </Form.Item>
        </Form>
        <Text className={styles.note}>Tài khoản được quản lý bằng biến môi trường của hệ thống.</Text>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return <ConfigProvider locale={viVN}><App><LoginForm /></App></ConfigProvider>;
}
