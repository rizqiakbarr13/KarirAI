import { NextResponse, type NextRequest } from "next/server";
import puppeteer from "puppeteer";
import { createClient } from "@/lib/supabase/server";
import { renderCVHtml } from "@/lib/pdf-templates";
import { normalizeCVData } from "@/lib/cv";
import type { Resume } from "@/types";

interface RouteParams {
  params: { id: string };
}

function buildHtmlDocument(markup: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          indigo: { DEFAULT: '#2d3a8c' },
          sand: { DEFAULT: '#f7f5f0' },
          warm: { DEFAULT: '#e8a849' },
          dark: { DEFAULT: '#1a1a2e' },
        },
        borderRadius: { card: '12px', control: '10px' },
        boxShadow: {
          card: '0 1px 3px rgba(0,0,0,0.06)',
          modal: '0 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
  };
</script>
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
</style>
</head>
<body>${markup}</body>
</html>`;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single<Resume>();

  if (!resume) {
    return NextResponse.json({ error: "CV tidak ditemukan" }, { status: 404 });
  }

  const cvData = normalizeCVData(resume.data);
  const markup = renderCVHtml(cvData, resume.template);
  const html = buildHtmlDocument(markup);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title || "CV"}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal membuat PDF" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
