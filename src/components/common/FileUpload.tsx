import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { StoredDocument } from '../../types/domain';

const ACCEPTED_MIME: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

function sizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function compressImage(file: File): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let w = img.width;
      let h = img.height;
      if (w > MAX) { h = Math.round((h / w) * MAX); w = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) { resolve({ blob: file, dataUrl: '' }); return; }
          const reader = new FileReader();
          reader.onload = () => resolve({ blob, dataUrl: reader.result as string });
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.7,
      );
    };
    img.src = url;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

interface FileUploadProps {
  documents: StoredDocument[]
  onChange: (docs: StoredDocument[]) => void
  maxFiles?: number
  label?: string
  error?: string
}

export function FileUpload({
  documents, onChange, maxFiles = 10, label = 'Upload Documents', error,
}: FileUploadProps) {
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setBusy(true);
      const newDocs: StoredDocument[] = [];
      for (const file of accepted) {
        const isImage = file.type.startsWith('image/') && file.type !== 'image/gif';
        let dataUrl: string;
        let compressedSize = file.size;
        if (isImage) {
          const result = await compressImage(file);
          dataUrl = result.dataUrl || (await fileToDataUrl(file));
          compressedSize = result.blob.size;
        } else {
          dataUrl = await fileToDataUrl(file);
        }
        newDocs.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          kind: 'general',
          fileName: file.name,
          originalSizeBytes: file.size,
          compressedSizeBytes: compressedSize,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      onChange([...documents, ...newDocs].slice(0, maxFiles));
      setBusy(false);
    },
    [documents, onChange, maxFiles],
  );

  const removeDoc = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME,
    maxSize: 10 * 1024 * 1024,
    disabled: documents.length >= maxFiles,
  });

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-ink">{label}</p>
      <div
        {...getRootProps()}
        role="button"
        tabIndex={0}
        aria-label="Drop files here or click to browse"
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragActive
            ? 'border-primary bg-primary-soft/50 scale-[1.01]'
            : documents.length >= maxFiles
              ? 'cursor-not-allowed border-line opacity-50'
              : 'border-mist/40 hover:border-primary/60 hover:bg-primary-soft/20'
        }`}
      >
        <input {...getInputProps()} />
        {busy ? (
          <p className="text-sm font-medium text-mist">Compressing…</p>
        ) : (
          <>
            <span aria-hidden="true" className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-sm text-ink">
              Drag &amp; drop files here, or
              {' '}
              <span className="font-semibold text-primary underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-mist">PDF, JPG, PNG — Max 10 MB each</p>
          </>
        )}
      </div>
      {error && (
        <p role="alert" aria-live="polite" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
          <span aria-hidden="true" className="mt-px">⚠</span>
          <span>{error}</span>
        </p>
      )}

      {documents.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Uploaded files">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 text-sm">
              {doc.dataUrl.startsWith('data:image') ? (
                <img src={doc.dataUrl} alt={doc.fileName} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600">PDF</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{doc.fileName}</p>
                <p className="text-xs text-mist">
                  {sizeLabel(doc.originalSizeBytes)}
                  {doc.compressedSizeBytes < doc.originalSizeBytes && (
                    <>
                      {' '}
                      →
                      {sizeLabel(doc.compressedSizeBytes)}
                      {' '}
                      (compressed)
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                className="rounded-lg p-1.5 text-mist transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${doc.fileName}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
