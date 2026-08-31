"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Copy, Download, History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

function downloadAsDoc(filename: string, content: string) {
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>${content
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("")}</body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CoverLetterPage() {
  const { toast } = useToast();
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [background, setBackground] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, company, background }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal membuat surat lamaran");
      setContent(body.content);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    toast("Surat lamaran disalin ke clipboard");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Surat Lamaran AI</h1>
          <p className="text-sm text-dark/60">
            Buat surat lamaran yang relevan dalam hitungan detik.
          </p>
        </div>
        <Link href="/dashboard/cover-letter/history">
          <Button variant="secondary" size="sm">
            <History className="h-4 w-4" />
            Riwayat
          </Button>
        </Link>
      </div>

      <Card padding="lg">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Posisi yang Dilamar"
              placeholder="cth. Product Manager"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
            <Input
              label="Nama Perusahaan"
              placeholder="cth. PT Maju Bersama"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <Textarea
            label="Pengalaman Singkat"
            placeholder="Ceritakan pengalaman dan kelebihan yang relevan dengan posisi ini."
            rows={4}
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="self-start">
            <Sparkles className="h-4 w-4" />
            {loading ? "Membuat..." : "Generate"}
          </Button>
        </form>
      </Card>

      {content && (
        <Card padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Hasil Surat Lamaran</CardTitle>
            <CardDescription>Bisa diedit langsung di bawah ini</CardDescription>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
          />
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadAsDoc(`Surat Lamaran - ${position}`, content)}
            >
              <Download className="h-4 w-4" />
              Download DOCX
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
