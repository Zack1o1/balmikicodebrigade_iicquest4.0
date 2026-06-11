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

const WARDS = Array.from({ length: 32 }, (_, i) => `Ward ${i + 1}`);

// Storage key for persisting form data
const STORAGE_KEY = 'iic_pi_form_data';

interface ValidationErrors {
  nameEn?: string;
  nameNp?: string;
  dob?: string;
  phone?: string;
  email?: string;
  ward?: string;
  address?: string;
}

function validateNepaliPhone(phone: string): boolean {
  // Nepal phone: 98XXXXXXXX, 97XXXXXXXX, 96XXXXXXXX, 985XXXXXXX, 986XXXXXXX
  // Landline: 01XXXXXXX, 061XXXXXX etc
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:98|97|96)\d{8}$/.test(cleaned) || /^(?:985|986)\d{7}$/.test(cleaned) || /^0[1-9]\d{7,8}$/.test(cleaned);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(name: string): string | undefined {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 100) return 'Name must be at most 100 characters';
  if (/[<>&"']/.test(name)) return 'Name contains invalid characters';
  return undefined;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  fieldName: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onBlur: (field: string) => void;
  touched: Record<string, boolean>;
}

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  fieldName,
  placeholder,
  required = false,
  error,
  onBlur,
  touched,
}: InputFieldProps) => (
  <div>
    <label className="block text-sm text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => onBlur(fieldName)}
        className={`w-full mt-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue ${error && touched[fieldName] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      >
        {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
      </select>
    ) : type === 'date' ? (
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => onBlur(fieldName)}
        max={new Date().toISOString().split('T')[0]}
        className={`w-full mt-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue ${error && touched[fieldName] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => onBlur(fieldName)}
        placeholder={placeholder}
        className={`w-full mt-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue ${error && touched[fieldName] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      />
    )}
    {error && touched[fieldName] && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

export default function ApplicationSubmission({ onNext, service }: Props) {
  // Load persisted data from sessionStorage
  const [nameEn, setNameEn] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_nameEn`) || '');
  const [nameNp, setNameNp] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_nameNp`) || '');
  const [dob, setDob] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_dob`) || '');
  const [phone, setPhone] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_phone`) || '');
  const [email, setEmail] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_email`) || '');
  const [address, setAddress] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_address`) || '');
  const [ward, setWard] = useState(() => sessionStorage.getItem(`${STORAGE_KEY}_ward`) || WARDS[0]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Persist data on change
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_nameEn`, nameEn); }, [nameEn]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_nameNp`, nameNp); }, [nameNp]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_dob`, dob); }, [dob]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_phone`, phone); }, [phone]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_email`, email); }, [email]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_address`, address); }, [address]);
  useEffect(() => { sessionStorage.setItem(`${STORAGE_KEY}_ward`, ward); }, [ward]);

  const validate = (): ValidationErrors => {
    const errs: ValidationErrors = {};

    // Full Name validation
    const nameErr = validateName(nameEn);
    if (nameErr) errs.nameEn = nameErr;

    // Email validation
    if (!email.trim()) errs.email = 'Email is required';
    else if (!validateEmail(email)) errs.email = 'Invalid email format';

    // Phone validation
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (!validateNepaliPhone(phone)) errs.phone = 'Invalid Nepal phone number format';

    // Address validation
    if (!address.trim()) errs.address = 'Address is required';

    // DOB validation
    if (!dob) errs.dob = 'Date of birth is required';
    else {
      const birthDate = new Date(dob);
      const today = new Date();
      if (isNaN(birthDate.getTime())) errs.dob = 'Invalid date';
      else if (birthDate > today) errs.dob = 'Date of birth cannot be in the future';
      else if (today.getFullYear() - birthDate.getFullYear() > 150) errs.dob = 'Invalid date of birth';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const allErrors = validate();
    setErrors(prev => ({ ...prev, [field]: allErrors[field as keyof ValidationErrors] }));
  };

  const handleSubmit = () => {
    const allErrors = validate();
    setErrors(allErrors);
    setTouched({ nameEn: true, nameNp: true, dob: true, phone: true, email: true, ward: true, address: true });

    if (Object.keys(allErrors).length > 0) return;

    // Clear persisted data on successful submit
    const keys = ['nameEn', 'nameNp', 'dob', 'phone', 'email', 'address', 'ward'];
    keys.forEach(key => sessionStorage.removeItem(`${STORAGE_KEY}_${key}`));

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

  const allErrors = validate();
  const isValid = Object.keys(allErrors).length === 0;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Personal Information</h3>
        <span className="text-xs text-gray-400">All fields marked with * are required</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Full Name (English)"
          value={nameEn}
          onChange={setNameEn}
          fieldName="nameEn"
          placeholder="e.g. Ram Kumar Sharma"
          required
          error={errors.nameEn}
          onBlur={handleBlur}
          touched={touched}
        />
        <InputField
          label="Full Name (Nepali)"
          value={nameNp}
          onChange={setNameNp}
          fieldName="nameNp"
          placeholder="e.g. राम कुमार शर्मा"
          onBlur={handleBlur}
          touched={touched}
        />

        <InputField
          label="Date of Birth"
          value={dob}
          onChange={setDob}
          type="date"
          fieldName="dob"
          required
          error={errors.dob}
          onBlur={handleBlur}
          touched={touched}
        />
        <InputField
          label="Phone Number"
          value={phone}
          onChange={setPhone}
          fieldName="phone"
          placeholder="e.g. 9841234567"
          required
          error={errors.phone}
          onBlur={handleBlur}
          touched={touched}
        />

        <InputField
          label="Email Address"
          value={email}
          onChange={setEmail}
          type="email"
          fieldName="email"
          placeholder="e.g. ram@example.com"
          required
          error={errors.email}
          onBlur={handleBlur}
          touched={touched}
        />
        <InputField
          label="Ward Number"
          value={ward}
          onChange={setWard}
          type="select"
          fieldName="ward"
          required
          error={errors.ward}
          onBlur={handleBlur}
          touched={touched}
        />

        <div className="md:col-span-2">
          <InputField
            label="Permanent Address"
            value={address}
            onChange={setAddress}
            fieldName="address"
            placeholder="e.g. Ward-5, Kathmandu Metropolitan City"
            required
            error={errors.address}
            onBlur={handleBlur}
            touched={touched}
          />
        </div>
      </div>

      {Object.keys(errors).length > 0 && Object.values(touched).some(Boolean) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-medium">Please fix the errors above before continuing.</p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-lg font-medium transition ${
            isValid
              ? 'bg-primary-red text-white hover:bg-red-700 cursor-pointer'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
