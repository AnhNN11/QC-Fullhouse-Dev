"use client";

import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { MenuProps, TableProps } from "antd";
import viVN from "antd/locale/vi_VN";
import {
  AppstoreOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  FormOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  RightOutlined,
  SearchOutlined,
  StarFilled,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardData, TeacherRecord } from "@/lib/dashboard-types";
import EntityCrud from "@/components/entity-crud";
import DailyReport from "@/components/daily-report";
import SessionCalendar from "@/components/session-calendar";
import styles from "./page.module.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const defaultDashboard: DashboardData = {
  stats: { totalTeachers: 0, averageScore: 0, evaluatedSessions: 0, attentionNeeded: 0 },
  teachers: [],
  pendingRecordings: [],
  tip: "Chưa có dữ liệu gợi ý.",
};

type EvaluationSessionOption = {
  value: string;
  label: string;
};

const navItems: MenuProps["items"] = [
  { key: "overview", icon: <HomeOutlined />, label: "Tổng quan" },
  { key: "teachers", icon: <TeamOutlined />, label: "Quản lý giáo viên" },
  { key: "contests", icon: <TrophyOutlined />, label: "Quản lý contest" },
  { key: "courses", icon: <ReadOutlined />, label: "Quản lý khóa học" },
  { key: "classes", icon: <AppstoreOutlined />, label: "Quản lý lớp học" },
  { key: "sessions", icon: <ClockCircleOutlined />, label: "Buổi học & record" },
  { key: "calendar", icon: <CalendarOutlined />, label: "Lịch buổi học" },
  { key: "daily-report", icon: <FileDoneOutlined />, label: "Daily QC Report" },
];

function BrandMark() {
  return <div className={styles.brandMark} aria-hidden="true"><span>F</span></div>;
}

function QualityDashboard() {
  const { message } = App.useApp();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("overview");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dashboard, setDashboard] = useState<DashboardData>(defaultDashboard);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [evaluationSessions, setEvaluationSessions] = useState<EvaluationSessionOption[]>([]);
  const [evaluationSessionsLoading, setEvaluationSessionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluationForm] = Form.useForm();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const loadDashboard = useCallback(async (signal?: AbortSignal) => {
    const response = await fetch("/api/dashboard", { signal, cache: "no-store" });
    if (!response.ok) throw new Error("Không thể tải dashboard");
    setDashboard((await response.json()) as DashboardData);
  }, []);

  const loadEvaluationSessions = useCallback(async () => {
    setEvaluationSessionsLoading(true);
    try {
      const [sessionResponse, classResponse] = await Promise.all([
        fetch("/api/manage/sessions", { cache: "no-store" }),
        fetch("/api/manage/classes", { cache: "no-store" }),
      ]);
      if (!sessionResponse.ok || !classResponse.ok) throw new Error("Không thể tải danh sách buổi học");
      const sessionResult = (await sessionResponse.json()) as { items: Array<{ id: string; classId: string; sessionNo: number; date: string; startTime: string; recordingStatus: string }> };
      const classResult = (await classResponse.json()) as { items: Array<{ id: string; code: string; name: string }> };
      const classMap = new Map(classResult.items.map((item) => [item.id, item]));
      setEvaluationSessions(sessionResult.items
        .filter((item) => ["ready", "issue", "reviewed"].includes(item.recordingStatus))
        .map((item) => {
          const classItem = classMap.get(item.classId);
          return {
            value: item.id,
            label: `${item.date} · ${item.startTime} · ${classItem?.code ?? "Lớp không xác định"} · Buổi ${item.sessionNo}${item.recordingStatus === "reviewed" ? " · Đã đánh giá" : ""}`,
          };
        }));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể tải danh sách buổi học");
    } finally {
      setEvaluationSessionsLoading(false);
    }
  }, [message]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadDashboard(controller.signal).catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          message.warning("Đang hiển thị dữ liệu gần nhất do chưa kết nối được máy chủ.");
        }
      });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadDashboard, message]);

  async function submitEvaluation(values: { sessionId: string; score: number; note?: string }) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu đánh giá");
      message.success(result.message ?? "Đã lưu phiếu đánh giá");
      evaluationForm.resetFields();
      setEvaluationOpen(false);
      await Promise.all([loadDashboard(), loadEvaluationSessions()]);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể lưu đánh giá");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return dashboard.teachers.filter((item) => {
      const matchesSearch = !keyword || item.name.toLowerCase().includes(keyword) || item.subject.toLowerCase().includes(keyword);
      return matchesSearch && (status === "all" || item.status === status);
    });
  }, [dashboard.teachers, search, status]);

  const columns: TableProps<TeacherRecord>["columns"] = [
    {
      title: "GIÁO VIÊN", dataIndex: "name", key: "name",
      render: (_, record) => <Space size={10}><Avatar className={styles.avatar}>{record.initials}</Avatar><div><Text className={styles.className}>{record.name}</Text><div className={styles.classCode}>{record.subject}</div></div></Space>,
    },
    {
      title: "CHUYÊN MÔN", dataIndex: "subject", key: "subject",
      render: (value: string) => <Text className={styles.timeCell}>{value}</Text>,
    },
    {
      title: "SỐ LỚP", dataIndex: "classes", key: "classes", align: "center",
      render: (value: number) => <Space size={6}><ReadOutlined className={styles.mutedIcon} /><Text>{value}</Text></Space>,
    },
    {
      title: "ĐIỂM QC", dataIndex: "score", key: "score", align: "center",
      render: (value?: number) => value ? (
        <Progress type="circle" percent={value} size={42} strokeWidth={8} strokeColor={value >= 90 ? "#13a16b" : "#2f6fed"} format={() => <span className={styles.scoreText}>{value}</span>} />
      ) : <Text type="secondary">—</Text>,
    },
    {
      title: "XU HƯỚNG", dataIndex: "trend", key: "trend", align: "center",
      render: (value: number) => <Text className={value >= 0 ? styles.up : styles.down}>{value >= 0 ? "↑" : "↓"} {Math.abs(value)}%</Text>,
    },
    {
      title: "TRẠNG THÁI", dataIndex: "status", key: "status",
      render: (value: TeacherRecord["status"]) => {
        if (value === "active") return <Tag className={`${styles.statusTag} ${styles.statusCompleted}`}><CheckCircleFilled /> Đạt yêu cầu</Tag>;
        if (value === "reviewing") return <Tag className={`${styles.statusTag} ${styles.statusReviewing}`}><ClockCircleOutlined /> Cần theo dõi</Tag>;
        return <Tag className={`${styles.statusTag} ${styles.statusPending}`}><InfoCircleOutlined /> Cần hỗ trợ</Tag>;
      },
    },
  ];

  return (
    <Layout className={styles.appShell}>
      <Sider width={246} collapsedWidth={80} collapsed={collapsed} breakpoint="lg" onBreakpoint={setCollapsed} className={styles.sider} theme="light">
        <div className={`${styles.brand} ${collapsed ? styles.brandCollapsed : ""}`}>
          <BrandMark />
          {!collapsed && <div className={styles.brandCopy}><strong>FULLHOUSE</strong><span>EDUCATION</span></div>}
        </div>
        {!collapsed && <div className={styles.navLabel}>KHÔNG GIAN QUẢN LÝ QC</div>}
        <Menu mode="inline" selectedKeys={[selectedMenu]} items={navItems} onClick={({ key }) => setSelectedMenu(key)} className={styles.navMenu} />
        <div className={styles.sidebarBottom}>
          <div className={styles.profileButton}>
            <Avatar className={styles.avatar}>QC</Avatar>
            {!collapsed && <div className={styles.profileText}><strong>QC Fullhouse</strong><span>Quản lý chất lượng</span></div>}
          </div>
          <button type="button" className={styles.collapseButton} onClick={() => setCollapsed((value) => !value)}>
            <MenuFoldOutlined rotate={collapsed ? 180 : 0} />{!collapsed && <span>Thu gọn menu</span>}
          </button>
        </div>
      </Sider>

      <Layout className={styles.mainLayout} style={{ marginLeft: collapsed ? 80 : 246 }}>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>Hệ thống quản lý chất lượng</div>
          <div className={styles.userMenu}>
            <Avatar className={styles.headerAvatar}>QC</Avatar>
            <div className={styles.headerUserText}><strong>QC Fullhouse</strong><span>Quản lý chất lượng</span></div>
            <Button type="text" icon={<LogoutOutlined />} aria-label="Đăng xuất" title="Đăng xuất" onClick={() => void logout()} />
          </div>
        </Header>

        {selectedMenu === "overview" ? <Content className={styles.content}>
          <section className={styles.welcomeSection}>
            <div><Title level={2}>Tổng quan chất lượng giảng dạy</Title><Text>Theo dõi hiệu suất và các vấn đề cần ưu tiên của đội ngũ giáo viên.</Text></div>
            <Button type="primary" icon={<FormOutlined />} onClick={() => { setEvaluationOpen(true); void loadEvaluationSessions(); }}>Tạo phiếu đánh giá</Button>
          </section>

          <Row gutter={[18, 18]} className={styles.statsRow}>
            <Col xs={24} sm={12} xl={6}><Card className={styles.statCard}><div className={`${styles.statIcon} ${styles.iconBlue}`}><TeamOutlined /></div><div><Text className={styles.statLabel}>Tổng giáo viên</Text><div className={styles.statValue}>{dashboard.stats.totalTeachers}</div><Text className={styles.statHint}>Đang quản lý trong hệ thống</Text></div></Card></Col>
            <Col xs={24} sm={12} xl={6}><Card className={styles.statCard}><div className={`${styles.statIcon} ${styles.iconGreen}`}><StarFilled /></div><div><Text className={styles.statLabel}>Điểm chất lượng TB</Text><div className={styles.statValue}>{dashboard.stats.averageScore}<span>/100</span></div><Text className={styles.statHint}>Cập nhật từ hồ sơ giáo viên</Text></div></Card></Col>
            <Col xs={24} sm={12} xl={6}><Card className={styles.statCard}><div className={`${styles.statIcon} ${styles.iconOrange}`}><FileSearchOutlined /></div><div><Text className={styles.statLabel}>Buổi đã đánh giá</Text><div className={styles.statValue}>{dashboard.stats.evaluatedSessions}</div><Text className={styles.statHint}>Tổng record đã hoàn tất QC</Text></div></Card></Col>
            <Col xs={24} sm={12} xl={6}><Card className={styles.statCard}><div className={`${styles.statIcon} ${styles.iconPurple}`}><InfoCircleOutlined /></div><div><Text className={styles.statLabel}>Cần ưu tiên hỗ trợ</Text><div className={styles.statValue}>{dashboard.stats.attentionNeeded}</div><Text className={styles.statHint}>Giáo viên cần coaching</Text></div></Card></Col>
          </Row>

          <Row gutter={[18, 18]} className={styles.bottomRow}>
            <Col xs={24} xl={16}>
              <Card className={`${styles.panelCard} ${styles.tableCard}`}>
                <div className={styles.cardHeading}><div><Title level={4}>Hiệu suất giáo viên</Title><Text>Danh sách và trạng thái chất lượng đội ngũ</Text></div></div>
                <div className={styles.tableToolbar}>
                  <Input allowClear prefix={<SearchOutlined />} placeholder="Tìm giáo viên hoặc chuyên môn..." value={search} onChange={(event) => setSearch(event.target.value)} />
                  <Select value={status} onChange={setStatus} options={[{ value: "all", label: "Tất cả trạng thái" }, { value: "active", label: "Đạt yêu cầu" }, { value: "reviewing", label: "Cần theo dõi" }, { value: "warning", label: "Cần hỗ trợ" }]} />
                </div>
                <Table columns={columns} dataSource={filteredRecords} pagination={false} scroll={{ x: 820 }} className={styles.qualityTable} />
                <div className={styles.tableFooter}><Text>Hiển thị {filteredRecords.length} trên {dashboard.stats.totalTeachers} giáo viên</Text></div>
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Card className={`${styles.panelCard} ${styles.scheduleCard}`}>
                <div className={styles.cardHeading}><div><Title level={4}>Record chờ kiểm tra</Title><Text>Các buổi học cần QC xem lại</Text></div><Button type="text" icon={<CalendarOutlined />} aria-label="Danh sách record" onClick={() => setSelectedMenu("sessions")} /></div>
                <div className={styles.scheduleList}>
                  {dashboard.pendingRecordings.map((item) => <div className={styles.scheduleItem} key={`${item.day}-${item.title}`}><div className={`${styles.dateBox} ${styles[item.color]}`}><strong>{item.day}</strong><span>{item.month}</span></div><div className={styles.scheduleInfo}><strong>{item.title}</strong><span><UserOutlined /> {item.teacher}</span><span><ClockCircleOutlined /> {item.reviewStatus}</span></div><Button type="text" icon={<RightOutlined />} aria-label={`Xem ${item.title}`} onClick={() => setSelectedMenu("sessions")} /></div>)}
                </div>
                <Button block className={styles.detailButton} onClick={() => setSelectedMenu("sessions")}>Xem toàn bộ record <RightOutlined /></Button>
              </Card>
              <div className={styles.tipCard}><div className={styles.tipIcon}>💡</div><div><strong>Gợi ý cải thiện</strong><p>{dashboard.tip}</p></div></div>
            </Col>
          </Row>
        </Content> : selectedMenu === "calendar" ? (
          <Content><SessionCalendar /></Content>
        ) : selectedMenu === "daily-report" ? (
          <Content><DailyReport /></Content>
        ) : ["teachers", "contests", "courses", "classes", "sessions"].includes(selectedMenu) ? (
          <Content><EntityCrud entity={selectedMenu as "teachers" | "contests" | "courses" | "classes" | "sessions"} /></Content>
        ) : null}
      </Layout>

      <Modal
        title="Đánh giá record buổi học"
        open={evaluationOpen}
        onCancel={() => setEvaluationOpen(false)}
        onOk={() => evaluationForm.submit()}
        okText="Lưu đánh giá"
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form form={evaluationForm} layout="vertical" onFinish={submitEvaluation} initialValues={{ score: 90 }}>
          <Form.Item name="sessionId" label="Buổi học / record" rules={[{ required: true, message: "Vui lòng chọn buổi học cần đánh giá" }]}>
            <Select
              showSearch
              loading={evaluationSessionsLoading}
              placeholder="Chọn record theo ngày, lớp và số buổi"
              optionFilterProp="label"
              options={evaluationSessions}
              notFoundContent={evaluationSessionsLoading ? "Đang tải..." : "Không có record cần đánh giá"}
            />
          </Form.Item>
          <Form.Item name="score" label="Điểm QC" rules={[{ required: true, message: "Vui lòng nhập điểm" }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} suffix="/ 100" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={4} maxLength={500} showCount placeholder="Điểm làm tốt và nội dung cần cải thiện..." />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default function Home() {
  return <ConfigProvider locale={viVN}><App><QualityDashboard /></App></ConfigProvider>;
}
