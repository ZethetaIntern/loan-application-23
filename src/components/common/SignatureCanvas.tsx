import { useCallback, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

interface SignatureCanvasProps {
  value?: string
  onChange: (dataUrl: string) => void
  error?: string
  width?: number
  height?: number
}

export function SignatureCanvas({
  value,
  onChange,
  error,
  width = 400,
  height = 200,
}: SignatureCanvasProps) {
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const initPad = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas || padRef.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const pad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255,255,255)',
        penColor: '#1a1a1a',
      });
      pad.addEventListener('beginStroke', () => setIsEmpty(false));
      pad.addEventListener('endStroke', () => {
        if (!pad.isEmpty()) onChange(canvas.toDataURL('image/png'));
      });
      padRef.current = pad;
    },
    [onChange],
  );

  const clear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
    onChange('');
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-white" style={{ width, height }}>
        <canvas
          ref={initPad}
          width={width}
          height={height}
          className="block touch-none"
          aria-label="E-signature canvas. Draw your signature here."
        />
        {value && isEmpty && (
          <img src={value} alt="Saved signature" className="absolute inset-0 h-full w-full object-contain opacity-30" />
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-mist transition-colors duration-200 hover:bg-surface hover:text-ink"
        >
          Clear
        </button>
        {isEmpty && !value && (
          <span className="self-center text-xs text-mist">Draw your signature above</span>
        )}
      </div>
      {error && (
        <p role="alert" aria-live="polite" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
          <span aria-hidden="true" className="mt-px">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
