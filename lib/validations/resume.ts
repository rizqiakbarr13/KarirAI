import { z } from "zod";

export const cvDataSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  telepon: z.string().min(1, "Telepon wajib diisi"),
  linkedin: z.string().optional(),
  ringkasan: z.string().min(1, "Ringkasan wajib diisi"),
  pengalaman: z.array(
    z.object({
      jabatan: z.string().min(1),
      perusahaan: z.string().min(1),
      periode: z.string().min(1),
      deskripsi: z.string(),
    })
  ),
  pendidikan: z.array(
    z.object({
      institusi: z.string().min(1),
      jurusan: z.string().min(1),
      tahun: z.string().min(1),
    })
  ),
  keahlian: z.array(z.string()),
  sertifikasi: z.array(z.string()).optional(),
  bahasa: z
    .array(z.object({ nama: z.string(), level: z.string() }))
    .optional(),
});

export const templateSchema = z.enum(["minimalis", "modern", "profesional"]);

export const createResumeSchema = z.object({
  title: z.string().min(1).optional(),
  data: cvDataSchema,
  template: templateSchema.optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  data: cvDataSchema.optional(),
  template: templateSchema.optional(),
});
