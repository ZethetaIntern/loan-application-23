export interface PinRecord {
  postOffice?: string
  city: string
  state: string
}

const DATASET: Record<string, PinRecord> = {
  '110001': { postOffice: 'Connaught Place', city: 'New Delhi', state: 'Delhi' },
  '110017': { postOffice: 'Saket', city: 'New Delhi', state: 'Delhi' },
  '400001': { postOffice: 'Fort', city: 'Mumbai', state: 'Maharashtra' },
  '400051': { postOffice: 'Andheri East', city: 'Mumbai', state: 'Maharashtra' },
  '411001': { postOffice: 'Pune Camp', city: 'Pune', state: 'Maharashtra' },
  '560001': { postOffice: 'Bengaluru GPO', city: 'Bengaluru', state: 'Karnataka' },
  '560034': { postOffice: 'Koramangala', city: 'Bengaluru', state: 'Karnataka' },
  '600001': { postOffice: 'Chennai GPO', city: 'Chennai', state: 'Tamil Nadu' },
  '600096': { postOffice: 'Perungudi', city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { postOffice: 'Kolkata GPO', city: 'Kolkata', state: 'West Bengal' },
  '500001': { postOffice: 'Hyderabad GPO', city: 'Hyderabad', state: 'Telangana' },
  '500081': { postOffice: 'Gachibowli', city: 'Hyderabad', state: 'Telangana' },
  '380001': { postOffice: 'Ahmedabad GPO', city: 'Ahmedabad', state: 'Gujarat' },
  '380015': { postOffice: 'Satellite', city: 'Ahmedabad', state: 'Gujarat' },
  '302001': { postOffice: 'Jaipur GPO', city: 'Jaipur', state: 'Rajasthan' },
  '226001': { postOffice: 'Lucknow GPO', city: 'Lucknow', state: 'Uttar Pradesh' },
  '211001': { postOffice: 'Prayagraj HO', city: 'Prayagraj', state: 'Uttar Pradesh' },
  '682001': { postOffice: 'Kochi GPO', city: 'Kochi', state: 'Kerala' },
  '695001': { postOffice: 'Thiruvananthapuram GPO', city: 'Thiruvananthapuram', state: 'Kerala' },
  '641001': { postOffice: 'Coimbatore GPO', city: 'Coimbatore', state: 'Tamil Nadu' },
  '625001': { postOffice: 'Madurai Main', city: 'Madurai', state: 'Tamil Nadu' },
  '781001': { postOffice: 'Guwahati GPO', city: 'Guwahati', state: 'Assam' },
  '800001': { postOffice: 'Patna GPO', city: 'Patna', state: 'Bihar' },
  '462001': { postOffice: 'Bhopal HO', city: 'Bhopal', state: 'Madhya Pradesh' },
  '452001': { postOffice: 'Indore HO', city: 'Indore', state: 'Madhya Pradesh' },
  '492001': { postOffice: 'Raipur HO', city: 'Raipur', state: 'Chhattisgarh' },
  '751001': { postOffice: 'Bhubaneswar GPO', city: 'Bhubaneswar', state: 'Odisha' },
  '160017': { postOffice: 'Sector 22 Chandigarh', city: 'Chandigarh', state: 'Chandigarh' },
  '141001': { postOffice: 'Ludhiana HO', city: 'Ludhiana', state: 'Punjab' },
  '248001': { postOffice: 'Dehradun HO', city: 'Dehradun', state: 'Uttarakhand' },
  '190001': { postOffice: 'Srinagar GPO', city: 'Srinagar', state: 'Jammu and Kashmir' },
  '403001': { postOffice: 'Panaji HO', city: 'Panaji', state: 'Goa' },
}

export interface LookupResult {
  found: boolean
  record?: PinRecord
}

export function lookupPinCode(pinCode: string): LookupResult {
  const value = pinCode.trim()
  if (!/^[1-9][0-9]{5}$/.test(value)) return { found: false }
  const record = DATASET[value]
  return record ? { found: true, record } : { found: false }
}

export function usePinCodeLookup(pinCode: string): { found: boolean; city?: string; state?: string; postOffice?: string } {
  const value = pinCode?.trim() ?? ''
  if (!/^[1-9][0-9]{5}$/.test(value)) return { found: false }
  const record = DATASET[value]
  return record ? { found: true, city: record.city, state: record.state, postOffice: record.postOffice } : { found: false }
}
