import type { CVData, Resume } from "@/types";

function esc(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

function contactLine(data: CVData, separator: string) {
  return [data.email, data.telepon, data.linkedin]
    .filter(Boolean)
    .map((v) => esc(v))
    .join(separator);
}

function minimalisHtml(data: CVData) {
  return `
  <div class="mx-auto max-w-[720px] bg-white p-10 text-[13px] text-neutral-800">
    <header class="border-b border-neutral-300 pb-4">
      <h1 class="text-2xl font-bold text-neutral-900">${esc(data.nama) || "Nama Lengkap"}</h1>
      <p class="mt-1 text-neutral-500">${contactLine(data, " &middot; ")}</p>
    </header>
    ${data.ringkasan ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Ringkasan</h2><p class="mt-2 leading-relaxed">${esc(data.ringkasan)}</p></section>` : ""}
    ${data.pengalaman.length ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pengalaman Kerja</h2><div class="mt-2 flex flex-col gap-3">${data.pengalaman
      .map(
        (exp) => `<div><div class="flex items-baseline justify-between"><p class="font-semibold text-neutral-900">${esc(exp.jabatan)}</p><p class="text-xs text-neutral-500">${esc(exp.periode)}</p></div><p class="text-neutral-600">${esc(exp.perusahaan)}</p><p class="mt-1 leading-relaxed text-neutral-700">${esc(exp.deskripsi)}</p></div>`
      )
      .join("")}</div></section>` : ""}
    ${data.pendidikan.length ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pendidikan</h2><div class="mt-2 flex flex-col gap-2">${data.pendidikan
      .map(
        (edu) => `<div class="flex items-baseline justify-between"><div><p class="font-semibold text-neutral-900">${esc(edu.institusi)}</p><p class="text-neutral-600">${esc(edu.jurusan)}</p></div><p class="text-xs text-neutral-500">${esc(edu.tahun)}</p></div>`
      )
      .join("")}</div></section>` : ""}
    ${data.keahlian.length ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Keahlian</h2><p class="mt-2 text-neutral-700">${data.keahlian.map(esc).join(" &middot; ")}</p></section>` : ""}
    ${data.sertifikasi?.length ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Sertifikasi</h2><p class="mt-2 text-neutral-700">${data.sertifikasi.map(esc).join(" &middot; ")}</p></section>` : ""}
    ${data.bahasa?.length ? `<section class="mt-5"><h2 class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Bahasa</h2><p class="mt-2 text-neutral-700">${data.bahasa.map((b) => `${esc(b.nama)} (${esc(b.level)})`).join(" &middot; ")}</p></section>` : ""}
  </div>`;
}

function modernHtml(data: CVData) {
  const initials = (data.nama || "NN")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return `
  <div class="mx-auto flex max-w-[720px] bg-white text-[13px] text-neutral-800">
    <aside class="w-[38%] bg-indigo px-6 py-8 text-white">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-bold">${esc(initials)}</div>
      <h1 class="mt-4 text-xl font-bold leading-tight">${esc(data.nama) || "Nama Lengkap"}</h1>
      <div class="mt-6 flex flex-col gap-1.5 text-white/80">
        ${data.email ? `<p>${esc(data.email)}</p>` : ""}
        ${data.telepon ? `<p>${esc(data.telepon)}</p>` : ""}
        ${data.linkedin ? `<p>${esc(data.linkedin)}</p>` : ""}
      </div>
      ${data.keahlian.length ? `<div class="mt-6"><h2 class="text-xs font-semibold uppercase tracking-wide text-white/70">Keahlian</h2><div class="mt-2 flex flex-wrap gap-1.5">${data.keahlian.map((s) => `<span class="rounded-full bg-white/15 px-2 py-0.5 text-xs">${esc(s)}</span>`).join("")}</div></div>` : ""}
      ${data.bahasa?.length ? `<div class="mt-6"><h2 class="text-xs font-semibold uppercase tracking-wide text-white/70">Bahasa</h2><div class="mt-2 flex flex-col gap-1">${data.bahasa.map((b) => `<p class="text-white/80">${esc(b.nama)} — ${esc(b.level)}</p>`).join("")}</div></div>` : ""}
    </aside>
    <main class="flex-1 px-6 py-8">
      ${data.ringkasan ? `<section><h2 class="text-xs font-semibold uppercase tracking-wide text-indigo">Ringkasan</h2><p class="mt-2 leading-relaxed text-neutral-700">${esc(data.ringkasan)}</p></section>` : ""}
      ${data.pengalaman.length ? `<section class="mt-6"><h2 class="text-xs font-semibold uppercase tracking-wide text-indigo">Pengalaman Kerja</h2><div class="mt-2 flex flex-col gap-3">${data.pengalaman
        .map(
          (exp) => `<div><div class="flex items-baseline justify-between"><p class="font-semibold text-neutral-900">${esc(exp.jabatan)}</p><p class="text-xs text-neutral-500">${esc(exp.periode)}</p></div><p class="text-neutral-600">${esc(exp.perusahaan)}</p><p class="mt-1 leading-relaxed text-neutral-700">${esc(exp.deskripsi)}</p></div>`
        )
        .join("")}</div></section>` : ""}
      ${data.pendidikan.length ? `<section class="mt-6"><h2 class="text-xs font-semibold uppercase tracking-wide text-indigo">Pendidikan</h2><div class="mt-2 flex flex-col gap-2">${data.pendidikan
        .map(
          (edu) => `<div class="flex items-baseline justify-between"><div><p class="font-semibold text-neutral-900">${esc(edu.institusi)}</p><p class="text-neutral-600">${esc(edu.jurusan)}</p></div><p class="text-xs text-neutral-500">${esc(edu.tahun)}</p></div>`
        )
        .join("")}</div></section>` : ""}
      ${data.sertifikasi?.length ? `<section class="mt-6"><h2 class="text-xs font-semibold uppercase tracking-wide text-indigo">Sertifikasi</h2><p class="mt-2 text-neutral-700">${data.sertifikasi.map(esc).join(" &middot; ")}</p></section>` : ""}
    </main>
  </div>`;
}

function profesionalHtml(data: CVData) {
  return `
  <div class="mx-auto max-w-[720px] bg-white p-10 text-[13px] text-neutral-800">
    <header class="text-center">
      <h1 class="text-2xl font-extrabold uppercase tracking-wide text-neutral-900">${esc(data.nama) || "Nama Lengkap"}</h1>
      <p class="mt-1.5 text-neutral-500">${contactLine(data, " | ")}</p>
    </header>
    <div class="mt-4 h-0.5 bg-dark"></div>
    ${data.ringkasan ? `<section class="mt-5"><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Ringkasan Profil</h2><div class="mt-1 h-px bg-neutral-300"></div><p class="mt-2 leading-relaxed">${esc(data.ringkasan)}</p></section>` : ""}
    ${data.pengalaman.length ? `<section class="mt-5"><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Pengalaman Kerja</h2><div class="mt-1 h-px bg-neutral-300"></div><div class="mt-2 flex flex-col gap-3">${data.pengalaman
      .map(
        (exp) => `<div><div class="flex items-baseline justify-between"><p class="font-bold text-neutral-900">${esc(exp.jabatan)}, ${esc(exp.perusahaan)}</p><p class="text-xs italic text-neutral-500">${esc(exp.periode)}</p></div><p class="mt-1 leading-relaxed text-neutral-700">${esc(exp.deskripsi)}</p></div>`
      )
      .join("")}</div></section>` : ""}
    ${data.pendidikan.length ? `<section class="mt-5"><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Pendidikan</h2><div class="mt-1 h-px bg-neutral-300"></div><div class="mt-2 flex flex-col gap-2">${data.pendidikan
      .map(
        (edu) => `<div class="flex items-baseline justify-between"><p class="font-bold text-neutral-900">${esc(edu.institusi)} — ${esc(edu.jurusan)}</p><p class="text-xs italic text-neutral-500">${esc(edu.tahun)}</p></div>`
      )
      .join("")}</div></section>` : ""}
    <div class="mt-5 grid grid-cols-2 gap-6">
      ${data.keahlian.length ? `<section><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Keahlian</h2><div class="mt-1 h-px bg-neutral-300"></div><ul class="mt-2 list-inside list-disc text-neutral-700">${data.keahlian.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}
      ${data.bahasa?.length ? `<section><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Bahasa</h2><div class="mt-1 h-px bg-neutral-300"></div><ul class="mt-2 list-inside list-disc text-neutral-700">${data.bahasa.map((b) => `<li>${esc(b.nama)} (${esc(b.level)})</li>`).join("")}</ul></section>` : ""}
    </div>
    ${data.sertifikasi?.length ? `<section class="mt-5"><h2 class="text-sm font-bold uppercase tracking-wide text-dark">Sertifikasi</h2><div class="mt-1 h-px bg-neutral-300"></div><ul class="mt-2 list-inside list-disc text-neutral-700">${data.sertifikasi.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></section>` : ""}
  </div>`;
}

export function renderCVHtml(data: CVData, template: Resume["template"]) {
  switch (template) {
    case "modern":
      return modernHtml(data);
    case "profesional":
      return profesionalHtml(data);
    case "minimalis":
    default:
      return minimalisHtml(data);
  }
}
