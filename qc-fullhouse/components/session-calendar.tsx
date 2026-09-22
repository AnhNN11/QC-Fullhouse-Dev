"use client";

import { App, Avatar, Badge, Button, Calendar, Card, Col, Empty, Row, Segmented, Spin, Tag, Typography } from "antd";
import { ClockCircleOutlined, PlayCircleOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./session-calendar.module.css";

dayjs.locale("vi");

type ScheduleSession = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionNo: number;
  topic: string;
  classCode: string;
  className: string;
  teacherName: string;
  teacherInitials: string;
  room: string;
  recordingUrl?: string;
  recordingStatus: string;
};

type Shift = "all" | "morning" | "afternoon" | "evening";

function getShift(startTime: string): Exclude<Shift, "all"> {
  const hour = Number(startTime.split(":")[0]);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function vietnamToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return dayjs(`${value.year}-${value.month}-${value.day}`);
}

export default function SessionCalendar() {
  const { message } = App.useApp();
  const [calendarValue, setCalendarValue] = useState<Dayjs>(vietnamToday);
  const [selectedDate, setSelectedDate] = useState(() => vietnamToday().format("YYYY-MM-DD"));
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [shift, setShift] = useState<Shift>("all");
  const [loading, setLoading] = useState(true);

  const loadMonth = useCallback(async (value: Dayjs) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/schedule?month=${value.format("YYYY-MM")}`, { cache: "no-store" });
      const result = (await response.json()) as { sessions?: ScheduleSession[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể tải lịch");
      setSessions(result.sessions ?? []);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Không thể tải lịch buổi học");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMonth(calendarValue); }, 0);
    return () => window.clearTimeout(timer);
  }, [calendarValue, loadMonth]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, ScheduleSession[]>();
    sessions.forEach((session) => map.set(session.date, [...(map.get(session.date) ?? []), session]));
    return map;
  }, [sessions]);

  const selectedSessions = useMemo(() => {
    const rows = sessionsByDate.get(selectedDate) ?? [];
    return shift === "all" ? rows : rows.filter((item) => getShift(item.startTime) === shift);
  }, [selectedDate, sessionsByDate, shift]);

  const selectedAll = sessionsByDate.get(selectedDate) ?? [];
  const eveningCount = selectedAll.filter((item) => getShift(item.startTime) === "evening").length;
  const teacherCount = new Set(selectedAll.map((item) => item.teacherName)).size;

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div><Typography.Title level={2}>Lịch buổi học</Typography.Title><Typography.Text>Xem số lượng lớp theo ngày, ca học và giáo viên phụ trách.</Typography.Text></div>
        <Segmented value={shift} onChange={(value) => setShift(value as Shift)} options={[{ label: "Tất cả", value: "all" }, { label: "Buổi sáng", value: "morning" }, { label: "Buổi chiều", value: "afternoon" }, { label: "Buổi tối", value: "evening" }]} />
      </div>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={16}>
          <Card className={styles.calendarCard}>
            <Spin spinning={loading}>
              <Calendar
                value={calendarValue}
                onSelect={(date, info) => {
                  setCalendarValue(date);
                  setSelectedDate(date.format("YYYY-MM-DD"));
                  if (info.source === "date") setShift("all");
                }}
                onPanelChange={(date) => {
                  setCalendarValue(date);
                  setSelectedDate(date.format("YYYY-MM-DD"));
                }}
                cellRender={(current, info) => {
                  if (info.type !== "date") return info.originNode;
                  const rows = sessionsByDate.get(current.format("YYYY-MM-DD")) ?? [];
                  if (!rows.length) return null;
                  const evening = rows.filter((item) => getShift(item.startTime) === "evening").length;
                  return <div className={styles.cellInfo}><strong>{rows.length} buổi</strong>{evening > 0 && <span>{evening} ca tối</span>}</div>;
                }}
              />
            </Spin>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <div className={styles.dayHeader}>
            <div><span>LỊCH TRONG NGÀY</span><strong>{dayjs(selectedDate).format("dddd, DD/MM/YYYY")}</strong></div>
            <Badge count={selectedAll.length} showZero color="#2f6fed" />
          </div>
          <Row gutter={[10, 10]} className={styles.dayStats}>
            <Col span={8}><Card><strong>{selectedAll.length}</strong><span>Buổi học</span></Card></Col>
            <Col span={8}><Card><strong>{eveningCount}</strong><span>Ca tối</span></Card></Col>
            <Col span={8}><Card><strong>{teacherCount}</strong><span>Giáo viên</span></Card></Col>
          </Row>
          <div className={styles.sessionList}>
            {selectedSessions.length ? selectedSessions.map((item) => (
              <Card key={item.id} className={styles.sessionCard}>
                <div className={styles.sessionTop}>
                  <Tag color={getShift(item.startTime) === "evening" ? "purple" : getShift(item.startTime) === "morning" ? "blue" : "orange"}>{item.startTime}–{item.endTime}</Tag>
                  <Typography.Text type="secondary">Buổi {item.sessionNo}</Typography.Text>
                </div>
                <Typography.Title level={5}>{item.className}</Typography.Title>
                <Typography.Text className={styles.classCode}>{item.classCode} · {item.room}</Typography.Text>
                <div className={styles.teacher}><Avatar size={28}>{item.teacherInitials}</Avatar><span><strong>{item.teacherName}</strong><small><TeamOutlined /> Giáo viên phụ trách</small></span></div>
                <div className={styles.topic}><ClockCircleOutlined /> {item.topic}</div>
                {item.recordingUrl && <Button block icon={<PlayCircleOutlined />} href={item.recordingUrl} target="_blank">Xem record</Button>}
              </Card>
            )) : <Card className={styles.emptyCard}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={shift === "all" ? "Không có buổi học" : "Không có lớp trong ca đã chọn"} /></Card>}
          </div>
        </Col>
      </Row>
    </div>
  );
}
