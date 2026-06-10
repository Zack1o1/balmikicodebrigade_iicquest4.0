import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function EsewaMock() {
  const [search] = useSearchParams();
  const amount = search.get('amount') || '0';
  const pid = search.get('pid') || 'P123';
  const merchant = search.get('merchant') || 'EPAYTEST';

  const handleSuccess = () => {
    try {
      window.opener?.postMessage({ type: 'esewa-success', pid, amount, merchant }, window.location.origin);
    } catch (e) {
      // ignore
    }
    window.close();
  };

  const handleFail = () => {
    try {
      window.opener?.postMessage({ type: 'esewa-fail', pid, amount, merchant }, window.location.origin);
    } catch (e) {
      // ignore
    }
    window.close();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-center">
        <h2 className="text-lg font-semibold mb-4">eSewa Sandbox</h2>
        <div className="text-sm text-gray-600 mb-2">Merchant: <strong>{merchant}</strong></div>
        <div className="text-sm text-gray-600 mb-2">Order: <strong>{pid}</strong></div>
        <div className="text-xl font-bold mb-6">Amount: NPR {amount}</div>
        <div className="flex justify-center gap-3">
          <button onClick={handleSuccess} className="px-4 py-2 bg-green-600 text-white rounded">Simulate Success</button>
          <button onClick={handleFail} className="px-4 py-2 bg-red-600 text-white rounded">Simulate Failure</button>
        </div>
      </div>
    </div>
  );
}
