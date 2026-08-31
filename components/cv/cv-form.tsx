"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "@/components/ui/step-indicator";
import { useToast } from "@/components/ui/toast";
import { TemplateCard } from "@/components/cv/template-card";
import { CVPreview } from "@/components/cv/cv-preview";
import { StepDataDiri } from "@/components/cv/steps/step-data-diri";
import { StepRingkasan } from "@/components/cv/steps/step-ringkasan";
import { StepPengalaman } from "@/components/cv/steps/step-pengalaman";
import { StepPendidikan } from "@/components/cv/steps/step-pendidikan";
import { StepKeahlian } from "@/components/cv/steps/step-keahlian";
import { normalizeCVData } from "@/lib/cv";
import { PLAN_LIMITS } from "@/lib/constants";
import { CV_TEMPLATES, CV_TEMPLATE_CATEGORIES } from "@/lib/cv-templates";
import type { CVData, PlanType, Resume } from "@/types";

const STEPS = ["Data Diri", "Ringkasan", "Pengalaman", "Pendidikan", "Keahlian"];

interface CVFormProps {
  resume: Resume;
  plan: PlanType;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function CVForm({ resume, plan }: CVFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState(resume.title);
  const [data, setData] = useState<CVData>(normalizeCVData(resume.data));
  const [template, setTemplate] = useState<Resume["template"]>(resume.template);
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [reviewing, setReviewing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const isFirstRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const availableTemplates = PLAN_LIMITS[plan].templates;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cv/${resume.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, data, template }),
        });
        if (!res.ok) throw new Error("Gagal menyimpan");
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 3000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, data, template]);

  const handleReview = async () => {
    setReviewing(true);
    try {
      const res = await fetch("/api/ai/review-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: resume.id, cvData: data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Fitur review AI belum tersedia");
      }
      router.push(`/dashboard/cv-review/${resume.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal me-review CV", "error");
    } finally {
      setReviewing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/cv/${resume.id}/export`, { method: "POST" });
      if (!res.ok) throw new Error("Fitur export PDF belum tersedia");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "CV"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal export PDF", "error");
    } finally {
      setExporting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepDataDiri data={data} onChange={setData} />;
      case 1:
        return <StepRingkasan data={data} onChange={setData} />;
      case 2:
        return <StepPengalaman data={data} onChange={setData} />;
      case 3:
        return <StepPendidikan data={data} onChange={setData} />;
      case 4:
        return <StepKeahlian data={data} onChange={setData} />;
      default:
        return null;
    }
  };

  const saveStatusLabel: Record<SaveStatus, string> = {
    idle: "",
    saving: "Menyimpan...",
    saved: "Tersimpan",
    error: "Gagal menyimpan",
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs text-base font-semibold"
          aria-label="Judul CV"
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-dark/40">{saveStatusLabel[saveStatus]}</span>
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? "Mengekspor..." : "Export PDF"}
          </Button>
          <Button size="sm" onClick={handleReview} disabled={reviewing}>
            <Sparkles className="h-4 w-4" />
            {reviewing ? "Memproses..." : "Review dengan AI"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <Button
          variant={mobileView === "form" ? "primary" : "secondary"}
          size="sm"
          className="flex-1"
          onClick={() => setMobileView("form")}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={mobileView === "preview" ? "primary" : "secondary"}
          size="sm"
          className="flex-1"
          onClick={() => setMobileView("preview")}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
          <div className="rounded-card border border-dark/10 bg-white p-6 shadow-card">
            <StepIndicator steps={STEPS} currentStep={step} onStepClick={setStep} />

            <div className="mt-8">{renderStep()}</div>

            <div className="mt-8 flex items-center justify-between border-t border-dark/10 pt-6">
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Kembali
              </Button>
              <Button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={step === STEPS.length - 1}
              >
                Lanjut
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-card border border-dark/10 bg-white p-6 shadow-card">
            <p className="text-sm font-semibold text-dark">Pilih Template</p>
            {CV_TEMPLATE_CATEGORIES.map((category) => {
              const templatesInCategory = CV_TEMPLATES.filter(
                (t) => t.category === category.value
              );
              return (
                <div key={category.value}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-dark/60">
                    {category.label}
                  </p>
                  <p className="mt-1 text-xs text-dark/40">{category.helperText}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {templatesInCategory.map((tpl) => (
                      <TemplateCard
                        key={tpl.id}
                        template={tpl.id}
                        label={tpl.label}
                        description={tpl.description}
                        active={template === tpl.id}
                        locked={!availableTemplates.includes(tpl.id)}
                        onSelect={() => {
                          if (!availableTemplates.includes(tpl.id)) {
                            toast("Upgrade ke Pro untuk membuka template ini", "error");
                            return;
                          }
                          setTemplate(tpl.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={mobileView === "form" ? "hidden lg:block" : ""}>
          <div className="lg:sticky lg:top-6">
            <CVPreview data={data} template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
