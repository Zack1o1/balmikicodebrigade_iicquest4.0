export interface Service {
  id: string;
  name: string;
  nameNep?: string;
  desc: string;
  time: string;
  fee: string;
  category: string;
  popular?: boolean;
  docs?: number;
  requiredDocs?: string[];
}

export const SERVICES: Service[] = [
  { id: 'birth', name: 'Birth Registration', nameNep: 'जन्म दर्ता', desc: 'Register a newborn child at the ward office. Required within 35 days of birth.', time: '3 Working Days', fee: 'Free', category: 'Civil', popular: true, docs: 4, requiredDocs: ['Hospital Birth Certificate', 'Citizenship of Father/Mother', 'Marriage Certificate of Parents'] },
  { id: 'death', name: 'Death Registration', nameNep: 'मृत्यु दर्ता', desc: 'Register a death for legal documentation and inheritance purposes.', time: '2 Working Days', fee: 'Free', category: 'Civil', popular: false, docs: 3, requiredDocs: ['Citizenship of Deceased', 'Citizenship of Informant', 'Hospital/Ward Death Report'] },
  { id: 'migration', name: 'Migration Certificate', nameNep: 'बसाइँसराइ प्रमाणपत्र', desc: 'Official certificate required when changing residence to a different ward or municipality.', time: '2 Working Days', fee: 'Rs. 200', category: 'Civil', popular: true, docs: 4, requiredDocs: ['Citizenship Certificate', 'Application Form', 'Tax Clearance Certificate', 'Passport Photo'] },
  { id: 'residence', name: 'Residence Verification', nameNep: 'बसोबास प्रमाणपत्र', desc: 'Verification of current residence for legal and administrative purposes.', time: '1 Working Day', fee: 'Rs. 100', category: 'Civil', popular: true, docs: 3, requiredDocs: ['Citizenship Certificate', 'Land Ownership/Rent Agreement', 'Recent Utility Bill'] },
  { id: 'house', name: 'House Recommendation', nameNep: 'घर सिफारिस', desc: 'Ward recommendation for house construction, renovation, or property transactions.', time: '5 Working Days', fee: 'Rs. 500', category: 'Property', popular: false, docs: 5, requiredDocs: ['Land Ownership Certificate', 'Blue Print/Trace', 'Tax Clearance Certificate', 'Citizenship Certificate'] },
  { id: 'business', name: 'Business Recommendation', nameNep: 'व्यवसाय सिफारिस', desc: 'Ward recommendation letter required for business registration and renewal.', time: '7 Working Days', fee: 'Rs. 1,000', category: 'Business', popular: false, docs: 6, requiredDocs: ['Citizenship Certificate', 'Business Application Form', 'Rent Agreement', 'Passport Photo'] },
  { id: 'citizenship', name: 'Citizenship Recommendation', nameNep: 'नागरिकता सिफारिस', desc: 'Ward office recommendation for citizenship certificate application.', time: '3 Working Days', fee: 'Rs. 200', category: 'Identity', popular: true, docs: 5, requiredDocs: ['Birth Certificate', 'Parents Citizenship', 'Academic Certificate (if any)', 'Passport Photo'] },
  { id: 'relation', name: 'Relationship Certificate', nameNep: 'नाता प्रमाणित', desc: 'Certification of family relationship for legal, educational, or administrative needs.', time: '2 Working Days', fee: 'Rs. 200', category: 'Civil', popular: false, docs: 4, requiredDocs: ['Citizenship of Applicant', 'Citizenship of Relatives', 'Application Form'] },
  { id: 'income', name: 'Income Certificate', nameNep: 'आय प्रमाणपत्र', desc: 'Official income verification document for scholarships, loans, and welfare programs.', time: '2 Working Days', fee: 'Rs. 150', category: 'Financial', popular: false, docs: 3, requiredDocs: ['Citizenship Certificate', 'Salary Certificate/Business Ward Reg', 'Tax Clearance Certificate'] },
];

export default SERVICES;
