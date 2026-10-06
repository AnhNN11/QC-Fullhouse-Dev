import { spawn } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";
import { normalizeFullhouseCookie } from "@/lib/fullhouse-cookie.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type CrawlPayload = {
  cookie?: string;
  contestCode?: string;
  crawlDate?: string;
  generateAudio?: boolean;
};

let crawlRunning = false;

function runCrawler(cookie: string, contestCode: string, crawlDate: string, generateAudio: boolean) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const script = path.join(process.cwd(), "scripts", "crawl-sessions.mjs");
    const args = [
      script,
      ...(contestCode ? [`--contest=${contestCode}`] : []),
      ...(crawlDate ? [`--date=${crawlDate}`] : []),
      ...(generateAudio ? ["--with-audio"] : []),
    ];
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      env: { ...process.env, FULLHOUSE_SESSION_COOKIE: cookie },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Crawler chạy quá 10 phút và đã được dừng."));
    }, 10 * 60 * 1000);

    child.stdout.on("data", (chunk) => { stdout = `${stdout}${chunk}`.slice(-20_000); });
    child.stderr.on("data", (chunk) => { stderr = `${stderr}${chunk}`.slice(-20_000); });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr.trim() || stdout.trim() || `Crawler dừng với mã ${code}.`));
    });
  });
}

export async function POST(request: Request) {
  if (crawlRunning) {
    return NextResponse.json({ error: "Một lượt crawl khác đang chạy. Vui lòng chờ hoàn tất." }, { status: 409 });
  }

  let ownsLock = false;
  try {
    const body = (await request.json()) as CrawlPayload;
    let cookie: string;
    try {
      cookie = normalizeFullhouseCookie(body?.cookie);
    } catch {
      return NextResponse.json({ error: "Cookie không hợp lệ. Cần sessionid không rỗng; hỗ trợ JSON, Netscape hoặc name=value." }, { status: 400 });
    }
    const contestCode = body.contestCode?.trim() ?? "";
    const crawlDate = body.crawlDate?.trim() ?? "";
    const generateAudio = body.generateAudio !== false;
    if (contestCode && !/^[a-zA-Z0-9_-]{1,100}$/.test(contestCode)) {
      return NextResponse.json({ error: "Mã contest không hợp lệ." }, { status: 400 });
    }
    if (crawlDate && !/^\d{4}-\d{2}-\d{2}$/.test(crawlDate)) {
      return NextResponse.json({ error: "Ngày crawl phải có định dạng YYYY-MM-DD." }, { status: 400 });
    }

    // Recheck after reading the body: another request may have acquired the lock.
    if (crawlRunning) {
      return NextResponse.json({ error: "Một lượt crawl khác đang chạy. Vui lòng chờ hoàn tất." }, { status: 409 });
    }
    crawlRunning = true;
    ownsLock = true;
    const result = await runCrawler(cookie, contestCode, crawlDate, generateAudio);
    const summary = result.stdout.trim().split("\n").filter(Boolean).at(-1) ?? "Đã crawl xong.";
    return NextResponse.json({ message: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể chạy crawler.";
    return NextResponse.json({ error: message.slice(0, 2_000) }, { status: 500 });
  } finally {
    if (ownsLock) crawlRunning = false;
  }
}
