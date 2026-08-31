import Anthropic from '@anthropic-ai/sdk';
import type { AIReviewResult, CVData } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = 'claude-sonnet-4-6';

function extractText(content: Anthropic.Messages.ContentBlock[]) {
  return content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

// ── CV Review ──
export async function reviewCV(cvData: CVData): Promise<AIReviewResult> {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `Kamu adalah career coach profesional Indonesia yang ahli dalam ATS screening.
Analisis CV dan berikan response JSON SAJA tanpa teks lain:
{
  "skor": <1-100>,
  "verdict": "<1 kalimat penilaian>",
  "dimensi": {
    "kelengkapan": <1-100>,
    "kata_kunci": <1-100>,
    "struktur": <1-100>,
    "ats_readability": <1-100>
  },
  "saran": ["<saran 1>", "<saran 2>", "<saran 3>"]
}
Saran harus spesifik, actionable, dan merujuk section tertentu di CV.`,
    messages: [{ role: 'user', content: `Review CV ini:\n${JSON.stringify(cvData, null, 2)}` }],
  });
  const text = extractText(msg.content);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

// ── Cover Letter ──
export async function generateCoverLetter(position: string, company: string, background: string) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `Kamu adalah penulis surat lamaran profesional Indonesia.
Tulis surat lamaran 3-4 paragraf, formal tapi tidak kaku.
Langsung tulis surat lamarannya. Jangan tambahkan komentar.`,
    messages: [{
      role: 'user',
      content: `Posisi: ${position}\nPerusahaan: ${company}\nLatar belakang pelamar: ${background}`,
    }],
  });
  return extractText(msg.content);
}

// ── Interview ──
export async function interviewTurn(
  position: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  questionNumber: number,
  totalQuestions: number
) {
  const isLast = questionNumber >= totalQuestions;
  const systemPrompt = `Kamu adalah HRD profesional Indonesia yang interview kandidat untuk posisi ${position}.
${isLast
    ? 'Ini jawaban terakhir. Beri feedback ringkas: skor 1-100, 2 kelebihan, 2 area improvement. Tutup interview dengan ramah.'
    : 'Beri komentar sangat singkat (1 kalimat) tentang jawaban, lalu ajukan 1 pertanyaan baru.'}
Gunakan Bahasa Indonesia, ramah tapi profesional.`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: history,
  });
  return extractText(msg.content);
}
