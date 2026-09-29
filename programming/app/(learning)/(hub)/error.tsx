'use client';

export default function HubError({ reset }: { reset: () => void }) {
  return <main className="hub-main"><section className="hub-empty"><h1>Chưa tải được nội dung</h1><p>Hãy thử lại sau ít phút.</p><button className="hub-button" onClick={reset}>Thử lại</button></section></main>;
}
