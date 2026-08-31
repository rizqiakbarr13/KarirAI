import type { CVData } from "@/types";

export function ProfesionalTemplate({ data }: { data: CVData }) {
  return (
    <div className="mx-auto aspect-[1/1.414] w-full max-w-[720px] overflow-y-auto bg-white p-10 text-[13px] text-neutral-800 shadow-card">
      <header className="text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-neutral-900">
          {data.nama || "Nama Lengkap"}
        </h1>
        <p className="mt-1.5 text-neutral-500">
          {[data.email, data.telepon, data.linkedin].filter(Boolean).join(" | ")}
        </p>
      </header>
      <div className="mt-4 h-0.5 bg-dark" />

      {data.ringkasan && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
            Ringkasan Profil
          </h2>
          <div className="mt-1 h-px bg-neutral-300" />
          <p className="mt-2 leading-relaxed">{data.ringkasan}</p>
        </section>
      )}

      {data.pengalaman.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
            Pengalaman Kerja
          </h2>
          <div className="mt-1 h-px bg-neutral-300" />
          <div className="mt-2 flex flex-col gap-3">
            {data.pengalaman.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-neutral-900">
                    {exp.jabatan}, {exp.perusahaan}
                  </p>
                  <p className="text-xs italic text-neutral-500">{exp.periode}</p>
                </div>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-neutral-700">
                  {exp.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.pendidikan.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
            Pendidikan
          </h2>
          <div className="mt-1 h-px bg-neutral-300" />
          <div className="mt-2 flex flex-col gap-2">
            {data.pendidikan.map((edu, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <p className="font-bold text-neutral-900">
                  {edu.institusi} — {edu.jurusan}
                </p>
                <p className="text-xs italic text-neutral-500">{edu.tahun}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-5 grid grid-cols-2 gap-6">
        {data.keahlian.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
              Keahlian
            </h2>
            <div className="mt-1 h-px bg-neutral-300" />
            <ul className="mt-2 list-inside list-disc text-neutral-700">
              {data.keahlian.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {data.bahasa && data.bahasa.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
              Bahasa
            </h2>
            <div className="mt-1 h-px bg-neutral-300" />
            <ul className="mt-2 list-inside list-disc text-neutral-700">
              {data.bahasa.map((b, i) => (
                <li key={i}>
                  {b.nama} ({b.level})
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {data.sertifikasi && data.sertifikasi.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-dark">
            Sertifikasi
          </h2>
          <div className="mt-1 h-px bg-neutral-300" />
          <ul className="mt-2 list-inside list-disc text-neutral-700">
            {data.sertifikasi.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
