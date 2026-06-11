import { useState, useRef, useEffect } from 'react';
import type { Service } from '../../data/services';
import { sanitizeFilename } from '../../utils/sanitize';

interface Props {
  service: Service;
  requiredCount?: number;
  onNext: (files: File[]) => void;
}

interface UploadItem {
  id: string;
  file: File;
  preview?: string;
  docLabel?: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png';
const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadDocuments({ service, requiredCount = 0, onNext }: Props) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const requiredDocs = service.requiredDocs || [];

  useEffect(() => {
    return () => {
      items.forEach((it) => it.preview && URL.revokeObjectURL(it.preview));
    };
  }, [items]);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const newItems: UploadItem[] = [];
    const newErrors: string[] = [];

    Array.from(filesList).forEach((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['.png', '.jpg', '.jpeg'];
      if (!allowedExtensions.includes(ext)) {
        newErrors.push(`${f.name}: only PNG, JPG, JPEG files are allowed`);
        return;
      }
      if (!ACCEPTED_TYPES.includes(f.type)) {
        newErrors.push(`${f.name}: unsupported file type (${f.type})`);
        return;
      }
      if (f.size > MAX_SIZE) {
        newErrors.push(`${f.name}: file is larger than 5MB`);
        return;
      }
      const safeName = sanitizeFilename(f.name);
      const sanitizedFile = new File([f], safeName, { type: f.type });
      const preview = f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;

      const nextIdx = items.length + newItems.length;
      const docLabel = nextIdx < requiredDocs.length ? requiredDocs[nextIdx] : undefined;

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: sanitizedFile,
        preview,
        docLabel,
      });
    });

    if (newErrors.length) setErrors((prev) => [...prev, ...newErrors]);
    if (newItems.length) setItems((prev) => [...prev, ...newItems]);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.currentTarget.value = '';
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id);
      if (it?.preview) URL.revokeObjectURL(it.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const enough = items.length >= (requiredDocs.length || requiredCount || service.docs || 0);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-3">Upload Documents</h3>

      {requiredDocs.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Required Documents:</p>
          <ul className="list-disc pl-5 space-y-1">
            {requiredDocs.map((doc, i) => {
              const isUploaded = i < items.length;
              return (
                <li key={i} className={`text-sm ${isUploaded ? 'text-green-700' : 'text-gray-600'}`}>
                  {doc}
                  {isUploaded && <span className="ml-2 text-green-600">✓</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-4 text-center hover:border-primary-red backdrop-blur-sm bg-white/60"
      >
        <p className="text-sm text-gray-600 mb-2">Drag & drop files here, or</p>
        <label className="inline-block bg-gray-100 px-4 py-2 rounded cursor-pointer text-sm">
          <input type="file" multiple onChange={onInputChange} accept={ACCEPTED_EXTENSIONS} className="hidden" />
          Click to select files
        </label>
        <div className="text-xs text-gray-400 mt-2">Allowed: JPG, PNG only — Max 5MB each</div>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 space-y-1">
          {errors.map((e, i) => (
            <div key={i} className="text-sm text-red-600">{e}</div>
          ))}
        </div>
      )}

      <ul className="space-y-2 mb-4">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
            {it.preview ? (
              <img src={it.preview} alt={it.file.name} className="w-12 h-12 object-cover rounded" />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-white border rounded text-sm text-gray-500">IMG</div>
            )}
            <div className="flex-1 min-w-0">
              {it.docLabel && (
                <div className="text-xs font-medium text-gray-500 truncate">{it.docLabel}</div>
              )}
              <div className="text-sm font-medium truncate">{it.file.name}</div>
              <div className="text-xs text-gray-500">{(it.file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button type="button" onClick={() => removeItem(it.id)} className="text-sm text-red-600 shrink-0">Remove</button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <button
          onClick={() => onNext(items.map((i) => i.file))}
          disabled={!enough}
          className={`px-4 py-2 rounded ${enough ? 'bg-primary-red text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
