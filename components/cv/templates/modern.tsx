import type { CVData } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function ModernTemplate({ data }: { data: CVData }) {
  return (
    <div className="mx-auto flex aspect-[1/1.414] w-full max-w-[720px] overflow-y-auto bg-white text-[13px] text-neutral-800 shadow-card">
      <aside className="w-[38%] bg-indigo px-6 py-8 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-bold">
          {initials(data.nama || "NN")}
        </div>
        <h1 className="mt-4 text-xl font-bold leading-tight">
          {data.nama || "Nama Lengkap"}
        </h1>

        <div className="mt-6 flex flex-col gap-1.5 text-white/80">
          {data.email && <p className="break-words">{data.email}</p>}
          {data.telepon && <p>{data.telepon}</p>}
          {data.linkedin && <p className="break-words">{data.linkedin}</p>}
        </div>

        {data.keahlian.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Keahlian
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.keahlian.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/15 px-2 py-0.5 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.bahasa && data.bahasa.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Bahasa
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              {data.bahasa.map((b, i) => (
                <p key={i} className="text-white/80">
                  {b.nama} — {b.level}
                </p>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 px-6 py-8">
        {data.ringkasan && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo">
              Ringkasan
            </h2>
            <p className="mt-2 leading-relaxed text-neutral-700">{data.ringkasan}</p>
          </section>
        )}

        {data.pengalaman.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo">
              Pengalaman Kerja
            </h2>
            <div className="mt-2 flex flex-col gap-3">
              {data.pengalaman.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold text-neutral-900">{exp.jabatan}</p>
                    <p className="text-xs text-neutral-500">{exp.periode}</p>
                  </div>
                  <p className="text-neutral-600">{exp.perusahaan}</p>
                  <p className="mt-1 whitespace-pre-line leading-relaxed text-neutral-700">
                    {exp.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.pendidikan.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo">
              Pendidikan
            </h2>
            <div className="mt-2 flex flex-col gap-2">
              {data.pendidikan.map((edu, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">{edu.institusi}</p>
                    <p className="text-neutral-600">{edu.jurusan}</p>
                  </div>
                  <p className="text-xs text-neutral-500">{edu.tahun}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.sertifikasi && data.sertifikasi.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo">
              Sertifikasi
            </h2>
            <p className="mt-2 text-neutral-700">{data.sertifikasi.join(" · ")}</p>
          </section>
        )}
      </main>
    </div>
  );
}
