export default function DashboardLoading() {
  return (
    <main className="dashboard-loading" aria-label="Đang tải không gian học">
      <div className="loading-content">
        <div className="loading-line wide" />
        <div className="loading-line" />
        <div className="loading-grid"><div /><div /><div /></div>
      </div>
    </main>
  );
}
