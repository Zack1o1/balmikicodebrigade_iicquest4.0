import { useState, useEffect } from 'react';
import type { Service } from '../../data/services';
import { sanitize } from '../../utils/sanitize';

interface Props {
  service: Service;
  onNext: (data: {
    nameEn: string;
    nameNp: string;
    dob: string;
    phone: string;
    email: string;
    ward: string;
    address: string;
  }) => void;
}

const WARDS = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];

export default function ApplicationSubmission({ onNext }: Props) {
  const [nameEn, setNameEn] = useState('');
  const [nameNp, setNameNp] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState(WARDS[0]);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const ok = nameEn.trim().length > 1 && phone.trim().length >= 7 && email.includes('@');
    setValid(ok);
  }, [nameEn, phone, email]);

  const handleSubmit = () => {
    onNext({
      nameEn: sanitize(nameEn.trim()),
      nameNp: sanitize(nameNp.trim()),
      dob,
      phone: sanitize(phone.trim()),
      email: sanitize(email.trim()),
      ward,
      address: sanitize(address.trim()),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Personal Information</h3>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700">Full Name (English)<span className="text-sm text-red-600">*</span></label>
          <input value={nameEn} onChange={e => setNameEn(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Full Name (Nepali)<span className="text-sm text-red-600">*</span></label>
          <input value={nameNp} onChange={e => setNameNp(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Date of Birth<span className="text-sm text-red-600">*</span></label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Phone Number<span className="text-sm text-red-600">*</span></label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email Address<span className="text-sm text-red-600">*</span> </label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Ward Number<span className="text-sm text-red-600">*</span></label>
          <select value={ward} onChange={e => setWard(e.target.value)} className="w-full mt-1 p-2 border rounded">
            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700">Permanent Address<span className="text-sm text-red-600">*</span></label>
          <input value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid}
          className={`px-4 py-2 rounded ${valid ? 'bg-primary-red text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
