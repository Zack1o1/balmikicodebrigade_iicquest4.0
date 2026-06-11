import type { Service } from '../../data/services';
import { sanitize } from '../../utils/sanitize';

interface Props {
  service: Service;
  data: Record<string, unknown>;
}

export default function Confirmation({ service, data }: Props) {
  const trackingId = data.applicationId || data.id || data.trackingId || '—';

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Application Submitted</h2>
      <p className="text-gray-700 mb-4">Your application for <strong>{sanitize(service.name)}</strong> has been received.</p>
      <div className="text-sm text-gray-600">Tracking ID: <span className="font-mono font-bold text-primary-blue">{sanitize(String(trackingId))}</span></div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">We will contact you with updates.</p>
      </div>
    </div>
  );
}
