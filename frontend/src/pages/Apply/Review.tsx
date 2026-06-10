import type { Service } from '../../data/services';
import { sanitize } from '../../utils/sanitize';

interface PIResult {
  nameEn: string;
  nameNp: string;
  dob: string;
  phone: string;
  email: string;
  ward: string;
  address: string;
}

interface Props {
  service: Service | null;
  piData: PIResult | null;
  files: File[];
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

export default function Review({ service, piData, files, onEdit, onConfirm }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Review & Submit</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Service</div>
            <div className="font-medium">{sanitize(service?.name || '')}</div>
          </div>
          <button onClick={() => onEdit(0)} className="text-sm text-blue-600">Change</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500">Personal Information</div>
        <div className="mt-2 text-sm text-gray-700">
          <div><strong>Name (English):</strong> {sanitize(piData?.nameEn || '')}</div>
          <div><strong>Name (Nepali):</strong> {sanitize(piData?.nameNp || '')}</div>
          <div><strong>Date of Birth:</strong> {sanitize(piData?.dob || '')}</div>
          <div><strong>Phone:</strong> {sanitize(piData?.phone || '')}</div>
          <div><strong>Email:</strong> {sanitize(piData?.email || '')}</div>
          <div><strong>Ward:</strong> {sanitize(piData?.ward || '')}</div>
          <div><strong>Address:</strong> {sanitize(piData?.address || '')}</div>
        </div>
        <div className="mt-2">
          <button onClick={() => onEdit(1)} className="text-sm text-blue-600">Edit</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500">Uploaded Documents</div>
        <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
          {files.length === 0 ? <li>No files uploaded</li> : files.map((f, i) => <li key={i}>{sanitize(f.name)}</li>)}
        </ul>
        <div className="mt-2">
          <button onClick={() => onEdit(2)} className="text-sm text-blue-600">Edit</button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onConfirm} className="px-4 py-2 rounded bg-primary-red text-white">Confirm & Proceed</button>
      </div>
    </div>
  );
}
