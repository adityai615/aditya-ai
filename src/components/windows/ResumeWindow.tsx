"use client";

import { useEffect, useMemo, useState } from "react";

const PRIMARY_PDF_URL = "/resume.pdf";
const FALLBACK_PDF_URL = "/AdityaJain.pdf";

type ActionButtonProps = {
  href: string;
  label: string;
  target?: "_blank";
  download?: boolean;
};

function ActionButton({ href, label, target, download = false }: ActionButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      download={download}
      className="text-label inline-flex h-8 items-center rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)]"
    >
      {label}
    </a>
  );
}

export function ResumeWindow() {
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState(PRIMARY_PDF_URL);
  const [isCheckingSource, setIsCheckingSource] = useState(true);
  const [isPreviewUnavailable, setIsPreviewUnavailable] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const resolvePdfSource = async () => {
      const trySource = async (url: string) => {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      };

      try {
        const primaryExists = await trySource(PRIMARY_PDF_URL);
        if (!isCancelled && primaryExists) {
          setResolvedPdfUrl(PRIMARY_PDF_URL);
          setIsCheckingSource(false);
          return;
        }

        const fallbackExists = await trySource(FALLBACK_PDF_URL);
        if (!isCancelled) {
          setResolvedPdfUrl(fallbackExists ? FALLBACK_PDF_URL : PRIMARY_PDF_URL);
          setIsPreviewUnavailable(!fallbackExists);
          setIsCheckingSource(false);
        }
      } catch {
        if (!isCancelled) {
          setResolvedPdfUrl(FALLBACK_PDF_URL);
          setIsCheckingSource(false);
        }
      }
    };

    resolvePdfSource();

    return () => {
      isCancelled = true;
    };
  }, []);

  const previewContent = useMemo(() => {
    if (isCheckingSource) {
      return (
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-ui text-[var(--os-text-muted)]">Loading resume preview...</p>
        </div>
      );
    }

    if (isPreviewUnavailable) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-ui text-[16px] font-medium text-[var(--os-text)]">
            Resume Preview Unavailable
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ActionButton href={resolvedPdfUrl} target="_blank" label="View Full PDF" />
            <ActionButton href={resolvedPdfUrl} download label="Download PDF" />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto p-3 sm:p-4 md:p-5">
        <div className="mx-auto w-full max-w-[980px]">
          <object
            data={resolvedPdfUrl}
            type="application/pdf"
            className="h-[min(1100px,75vh)] w-full rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)]"
            aria-label="Resume PDF preview"
            onError={() => setIsPreviewUnavailable(true)}
          >
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-ui text-[16px] font-medium text-[var(--os-text)]">
                Resume Preview Unavailable
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <ActionButton href={resolvedPdfUrl} target="_blank" label="View Full PDF" />
                <ActionButton href={resolvedPdfUrl} download label="Download PDF" />
              </div>
            </div>
          </object>
        </div>
      </div>
    );
  }, [isCheckingSource, isPreviewUnavailable, resolvedPdfUrl]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
            resume
          </p>
          <p className="text-label mt-0.5 text-[var(--os-text-muted)]">PDF Preview</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ActionButton href={resolvedPdfUrl} target="_blank" label="View Full PDF" />
          <ActionButton href={resolvedPdfUrl} download label="Download PDF" />
        </div>
      </header>

      <section className="flex-1 min-h-0 bg-[var(--os-background)]">{previewContent}</section>
    </div>
  );
}
