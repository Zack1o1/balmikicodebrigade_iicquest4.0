import React from 'react';
import type { Service } from '../../data/services';

interface Props {
  service: Service;
}

export default function DocumentChecker({ service }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-3">Required Documents</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        {Array.from({ length: service.docs || 0 }).map((_, i) => (
          <li key={i}>Document {i + 1} for {service.name}</li>
        ))}
      </ul>
      <div className="mt-4 text-sm text-gray-500">Processing time: {service.time}</div>
    </div>
  );
}
