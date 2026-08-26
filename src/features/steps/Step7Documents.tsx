import { useFormContext } from 'react-hook-form';
import type { ApplicationData } from '../../types/application';
import { FileUpload, SignatureCanvas } from '../../components/common';

type Step7 = ApplicationData['documents']

export function Step7Documents() {
  const { watch, setValue, formState: { errors } } = useFormContext<Step7>();
  const rawDocuments = watch('documents');
  const documents = Array.isArray(rawDocuments) ? rawDocuments : [];

  return (
    <div className="space-y-8">
      <FileUpload
        documents={documents}
        onChange={(docs) => setValue('documents', docs, { shouldValidate: true })}
        label="Upload Required Documents"
        error={errors.documents?.message}
      />

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">E-Signature</h3>
        <p className="mb-3 text-xs text-gray-500">
          Draw your signature in the box below. This will be used on your loan application.
        </p>
        <SignatureCanvas
          value={watch('signatureDataUrl')}
          onChange={(dataUrl) => setValue('signatureDataUrl', dataUrl, { shouldValidate: true })}
          error={errors.signatureDataUrl?.message}
        />
      </div>
    </div>
  );
}
