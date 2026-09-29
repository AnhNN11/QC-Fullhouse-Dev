'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="hub-main"><section className="hub-empty"><h1>Chưa tải được nội dung</h1><p>Dữ liệu của bạn vẫn được giữ. Hãy thử lại sau ít phút.</p><button className="hub-button" onClick={reset}>Thử lại</button></section></main>;}
