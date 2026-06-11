import { useState, useCallback } from 'react';
import type { Service } from '../../data/services';
import ESEWA from '../../config/esewa';
import { createApplication } from '../../api/applicationApi';

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
  service: Service;
  piData: PIResult | null;
  files: File[];
  onSubmit: (result: Record<string, unknown>) => void;
  onBack: () => void;
}

export default function SubmitStep({ service, piData, files, onSubmit, onBack }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const needsPayment = !!service.fee && service.fee.toLowerCase() !== 'free';

  const handleSubmit = useCallback(async () => {
    if (!accepted || submitting) return;
    if (needsPayment && !paid) return;
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        service: service.id,
        applicantName: piData?.nameEn || '',
        applicantNameNp: piData?.nameNp || '',
        dob: piData?.dob || '',
        phone: piData?.phone || '',
        email: piData?.email || '',
        ward: piData?.ward || '',
        address: piData?.address || '',
        documents: files.map((f) => ({ name: f.name, fileUrl: '' })),
        formData: piData,
      };

      const result = await createApplication(payload);

      try {
        const raw = localStorage.getItem('iic_applications');
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(result);
        localStorage.setItem('iic_applications', JSON.stringify(arr));
      } catch { }

      onSubmit(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [accepted, submitting, needsPayment, paid, service, piData, files, onSubmit]);

  const handlePayWithEsewa = useCallback(() => {
    if (paying) return;
    setPaying(true);
    const pid = `PAY-${Date.now().toString(36).toUpperCase()}`;
    const amountRaw = String(service.fee || '').replace(/[^0-9.]/g, '') || '0';
    const url = `${window.location.origin}/esewa-mock?amount=${encodeURIComponent(amountRaw)}&pid=${encodeURIComponent(pid)}&merchant=${encodeURIComponent(ESEWA.merchantId)}`;
    const w = window.open(url, 'esewa', 'width=480,height=700');

    const handler = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      const d = ev.data as Record<string, unknown>;
      if (d?.type === 'esewa-success') {
        setPaid(true);
        setPaying(false);
        window.removeEventListener('message', handler);
        try { w?.close(); } catch { }
      }
      if (d?.type === 'esewa-fail') {
        setPaid(false);
        setPaying(false);
        window.removeEventListener('message', handler);
        try { w?.close(); } catch { }
      }
    };

    window.addEventListener('message', handler);
  }, [paying, service.fee]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-3">Ready to Submit?</h3>
      <p className="text-gray-600 mb-4">Your application will be submitted to the municipality. You'll receive a unique tracking ID after submission.</p>

      <div className="mb-4 p-4 border rounded bg-orange-50 text-sm text-orange-800">
        <strong>Declaration</strong>
        <div className="mt-2">I hereby declare that the information provided is true and correct. I understand that false information may lead to rejection.</div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input id="agree" type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
        <label htmlFor="agree" className="text-sm text-gray-700">I agree to the declaration</label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} disabled={submitting} className="py-2 px-4 rounded border">Back</button>
        <div className="flex items-center gap-3">
          {needsPayment && (
            <div className="flex items-center gap-2">
              <button onClick={handlePayWithEsewa} disabled={paying || paid} className={`py-2 px-4 rounded ${paying ? 'bg-gray-200 text-gray-500' : paid ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                {paying ? 'Processing...' : paid ? 'Paid' : `Pay with eSewa (${service.fee})`}
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!accepted || submitting || (needsPayment && !paid)}
            className={`py-2 px-4 rounded ${(accepted && !submitting) ? 'bg-primary-red text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
