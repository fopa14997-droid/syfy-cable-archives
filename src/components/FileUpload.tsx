import type { ChangeEvent, ReactNode } from 'react';

export function FileUpload({ label, onChange, accept }: { label: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; accept?: string }) {
  return (
    <label className="upload-control">
      <span>{label}</span>
      <input type="file" accept={accept} onChange={onChange} />
    </label>
  );
}
