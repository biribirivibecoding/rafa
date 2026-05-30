"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react";

/**
 * Campo de imagem com upload direto: o usuario escolhe um arquivo, ele sobe
 * para o Storage via /api/upload e a URL publica volta pelo onChange.
 */
export function ImageUpload({
  value,
  onChange,
  label,
  shape = "square",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  shape?: "circle" | "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (data.ok) onChange(data.url);
    else setError(data.error || "Falha no upload");
  }

  const previewBox =
    shape === "circle"
      ? "h-20 w-20 rounded-full"
      : shape === "wide"
        ? "h-24 w-32 rounded-xl"
        : "h-16 w-16 rounded-xl";

  return (
    <div className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      ) : null}
      <div className="flex items-center gap-3">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50 ${previewBox}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-zinc-300" />
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn-ghost gap-2 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {busy ? "Enviando..." : value ? "Trocar imagem" : "Enviar imagem"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
