import React, { useState, useRef, useEffect } from 'react';
import type { Service } from '../../data/services';

interface Props {
  service: Service;
  requiredCount?: number;
  onNext: (files: File[]) => void;
}

type UploadItem = {
  id: string;
  file: File;
  preview?: string;
};

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name: string) {
  const base = name.split('\\').pop()?.split('/').pop() || name;
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

export default function UploadDocuments({ service, requiredCount = 0, onNext }: Props) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);

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
      if (!ACCEPTED_TYPES.includes(f.type)) {
        newErrors.push(`${f.name}: unsupported file type`);
        return;
      }
      if (f.size > MAX_SIZE) {
        newErrors.push(`${f.name}: file is larger than 5MB`);
        return;
      }
      const safeName = sanitizeFilename(f.name);
      try {
        const sanitizedFile = new File([f], safeName, { type: f.type });
        const preview = f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;
        newItems.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, file: sanitizedFile, preview });
      } catch (e) {
        // If File constructor unsupported, fallback to original
        const preview = f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;
        newItems.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, file: f, preview });
      }
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

  const enough = items.length >= (requiredCount || service.docs || 0);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-3">Upload Documents</h3>
      <p className="text-sm text-gray-500 mb-3">Required documents: {requiredCount || service.docs || 0}</p>

      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-4 text-center hover:border-primary-red backdrop-blur-sm bg-white/60"
      >
        <p className="text-sm text-gray-600 mb-2">Drag & drop files here, or</p>
        <label className="inline-block bg-gray-100 px-4 py-2 rounded cursor-pointer text-sm">
          <input type="file" multiple onChange={onInputChange} accept=".pdf,image/*" className="hidden" />
          Click to select files
        </label>
        <div className="text-xs text-gray-400 mt-2">Allowed: PDF, JPG, PNG — Max 5MB each</div>
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
              <div className="w-12 h-12 flex items-center justify-center bg-white border rounded text-sm text-gray-500">PDF</div>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium">{it.file.name}</div>
              <div className="text-xs text-gray-500">{(it.file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button type="button" onClick={() => removeItem(it.id)} className="text-sm text-red-600">Remove</button>
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
