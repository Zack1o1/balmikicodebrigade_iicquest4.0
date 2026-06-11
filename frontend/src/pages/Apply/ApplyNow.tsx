import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SERVICES from '../../data/services';
import type { Service } from '../../data/services';
import ApplicationSubmission from './ApplicationSubmission';
import UploadDocuments from './UploadDocuments';
import Review from './Review';
import SubmitStep from './SubmitStep';
import Confirmation from './Confirmation';

const STEPS = ['Select Service', 'Personal Information', 'Upload Documents', 'Review', 'Submit', 'Done'];

interface PIResult {
  nameEn: string;
  nameNp: string;
  dob: string;
  phone: string;
  email: string;
  ward: string;
  address: string;
}

export default function ApplyNow() {
  const { id } = useParams();
  const initialService = id ? SERVICES.find((s) => s.id === id) || null : null;
  const [selectedService, setSelectedService] = useState<Service | null>(initialService);
  const [step, setStep] = useState<number>(0);
  const [piData, setPiData] = useState<PIResult | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("iic_token");
    if (!token) {
      setAuthError("Not authorized: Please log in to access municipal application forms. Redirecting to the login page...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (step >= 2 && step <= 4 && !piData) {
      setSelectedService(null);
      setStep(1);
    }
  }, [step, piData]);

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleAsideNext = () => {
    if (authError) return;
    if (step >= 5) return;

    if (step === 0) {
      if (selectedService) setStep(1);
      return;
    }
    if (step === 1) {
      if (!piData) { setSelectedService(null); setStep(1); return; }
      setStep(2);
      return;
    }
    if (step === 2) {
      const required = selectedService?.docs || 0;
      if (files.length < required) return;
      setStep(3);
      return;
    }
    if (step === 3) { setStep(4); return; }
    if (step === 4) { setStep(5); return; }
  };

  const asideCanProceed = (() => {
    if (authError) return false;
    if (step >= 5) return false;
    if (step === 0) return !!selectedService;
    if (step === 1) return !!piData;
    if (step === 2) return files.length >= (selectedService?.docs || 0);
    return true;
  })();

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {authError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center border-t-4 border-red-600">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Please Login</h3>
            <p className="text-sm text-gray-600 mb-4">{authError}</p>
            <div className="flex justify-center items-center space-x-1">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 ${authError ? 'blur-xs pointer-events-none select-none' : ''}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Submit Application</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {STEPS.map((label, idx) => (
              <div key={label} className="flex items-center gap-3 shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === step ? 'bg-primary-red text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {idx + 1}
                </div>
                <div className={`text-sm ${idx === step ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</div>
                {idx < STEPS.length - 1 && <div className="w-8 border-t border-dashed border-gray-200 ml-2 mr-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {step === 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Select a Service</h2>
                <div className="space-y-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedService(s); setStep(1); }}
                      disabled={!!authError}
                      className={`w-full text-left p-4 rounded-lg border ${selectedService?.id === s.id ? 'border-primary-red bg-primary-red/10' : 'border-gray-100 bg-white'} flex items-center justify-between transition`}
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-500">{s.nameNep}</div>
                      </div>
                      <div className="text-sm text-gray-400">&gt;</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              {!selectedService && step !== 0 && (
                <div className="bg-white rounded-xl shadow p-6">Please select a service to continue.</div>
              )}

              {selectedService && step === 1 && (
                <ApplicationSubmission service={selectedService} onNext={(data) => { setPiData(data); setStep(2); }} />
              )}

              {selectedService && step === 2 && (
                <UploadDocuments service={selectedService} requiredCount={selectedService.docs || 0} onNext={(f) => { setFiles(f); setStep(3); }} />
              )}

              {selectedService && step === 3 && (
                <Review service={selectedService} piData={piData} files={files} onEdit={(s) => setStep(s)} onConfirm={() => setStep(4)} />
              )}

              {selectedService && step === 4 && (
                <SubmitStep service={selectedService} piData={piData} files={files} onBack={() => setStep(3)} onSubmit={(payload) => { setSubmittedData(payload); setStep(5); }} />
              )}

              {selectedService && step === 5 && submittedData && (
                <Confirmation service={selectedService} data={submittedData} />
              )}
            </div>
          </div>

          <aside className="bg-white rounded-xl shadow p-6 h-fit">
            <h3 className="font-semibold mb-4">Application Summary</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-500">Service</div>
                <div className="font-medium">{selectedService ? selectedService.name : 'Not selected'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Processing Time</div>
                <div className="font-medium">{selectedService ? selectedService.time : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Application Fee</div>
                <div className="font-medium">{selectedService ? selectedService.fee : '-'}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={goPrev} disabled={!!authError || step >= 5} className="flex-1 py-2 px-3 rounded border disabled:opacity-50">
                {step >= 5 ? 'Completed' : 'Back'}
              </button>
              <button
                onClick={handleAsideNext}
                disabled={!asideCanProceed}
                className={`flex-1 py-2 px-3 rounded transition ${asideCanProceed ? 'bg-primary-red text-white cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {step >= 5 ? 'Submitted' : 'Next'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
