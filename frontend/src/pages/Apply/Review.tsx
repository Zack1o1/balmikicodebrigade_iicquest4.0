import React from 'react';
import type { Service } from '../../data/services';

interface Props {
  service: Service | null;
  piData: { name: string; mobile: string; remarks?: string } | null;
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
            <div className="font-medium">{service?.name}</div>
          </div>
          <button onClick={() => onEdit(0)} className="text-sm text-blue-600">Change</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500">Personal Information</div>
        <div className="mt-2 text-sm text-gray-700">
          <div><strong>Name:</strong> {piData?.name}</div>
          <div><strong>Mobile:</strong> {piData?.mobile}</div>
          {piData?.remarks && <div><strong>Remarks:</strong> {piData.remarks}</div>}
        </div>
        <div className="mt-2">
          <button onClick={() => onEdit(1)} className="text-sm text-blue-600">Edit</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500">Uploaded Documents</div>
        <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
          {files.length === 0 ? <li>No files uploaded</li> : files.map((f, i) => <li key={i}>{f.name}</li>)}
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
