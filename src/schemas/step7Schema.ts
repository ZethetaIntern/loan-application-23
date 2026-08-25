import { z } from 'zod';

export const step7Schema = z.object({
  documents: z
    .array(
      z.object({
        id: z.string(),
        kind: z.string(),
        fileName: z.string(),
        originalSizeBytes: z.number(),
        compressedSizeBytes: z.number(),
        dataUrl: z.string(),
        uploadedAt: z.string(),
      }),
    )
    .min(1, 'Please upload at least the required documents.'),
  signatureDataUrl: z
    .string()
    .min(100, 'Please capture your e-signature.')
    .refine(
      (value) => value.startsWith('data:image/png;base64,'),
      'E-signature must be a PNG image captured from the canvas.',
    ),
});
