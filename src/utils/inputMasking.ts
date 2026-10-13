/**
 * Input format masking and normalization utilities for Philippine Basic Education
 * Adheres to DepEd LIS specifications, Telco standards (+63), and PSA registry conventions.
 */

/**
 * Dynamic mask for Philippine Mobile Numbers: +63 9XX-XXX-XXXX
 * Handles arbitrary paste/type inputs (e.g. 0917..., 63917..., 917...)
 */
export function formatPhilippineMobile(input: string): string {
  if (!input) return '';

  // Extract all numeric digits
  let digits = input.replace(/\D/g, '');

  // Strip leading national trunk prefix (0) or country code (63) if present
  if (digits.startsWith('63')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Philippine mobile numbers must start with 9
  if (digits.length > 0 && !digits.startsWith('9')) {
    // If user didn't start with 9, prepend 9 or let them type
    if (digits.startsWith('09')) {
      digits = digits.slice(1);
    }
  }

  // Cap at 10 digits (9XX-XXX-XXXX)
  digits = digits.slice(0, 10);

  if (digits.length === 0) {
    return '';
  }

  // Format into +63 9XX-XXX-XXXX
  let formatted = '+63 ';

  if (digits.length <= 3) {
    formatted += digits;
  } else if (digits.length <= 6) {
    formatted += `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    formatted += `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  return formatted;
}

/**
 * Validates whether formatted mobile number meets complete Philippine standard
 */
export function isValidPhilippineMobile(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, '');
  // Must have 12 digits (63 + 10 digits) or 10 digits starting with 9
  return (digits.startsWith('639') && digits.length === 12) || (digits.startsWith('9') && digits.length === 10);
}

/**
 * Dynamic format masking for Date of Birth: YYYY-MM-DD
 * Allows typing numbers directly or picking from standard date input
 */
export function formatDateOfBirthMask(input: string): string {
  if (!input) return '';

  // Extract digits
  let digits = input.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
}

/**
 * Validates YYYY-MM-DD format and chronological validity
 */
export function isValidDateOfBirth(dob: string): { isValid: boolean; message?: string } {
  if (!dob) {
    return { isValid: false, message: 'Date of birth is required.' };
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dob)) {
    return { isValid: false, message: 'Date format must be YYYY-MM-DD (e.g. 2010-08-15).' };
  }

  const [yearStr, monthStr, dayStr] = dob.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (year < 1990 || year > 2026) {
    return { isValid: false, message: 'Birth year must be between 1990 and 2026.' };
  }
  if (month < 1 || month > 12) {
    return { isValid: false, message: 'Invalid month (must be 01 to 12).' };
  }
  if (day < 1 || day > 31) {
    return { isValid: false, message: 'Invalid day of month.' };
  }

  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return { isValid: false, message: 'Calendar date does not exist.' };
  }

  if (d > new Date()) {
    return { isValid: false, message: 'Date of birth cannot be in the future.' };
  }

  return { isValid: true };
}

/**
 * Dynamic mask for 12-Digit DepEd LRN: XXXXXX-XXXXXX
 */
export function formatLRNMask(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 12);
  if (digits.length <= 6) {
    return digits;
  }
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

/**
 * Strips formatting to get raw 12-digit LRN
 */
export function cleanLRN(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

/**
 * Dynamic mask for 4Ps Household ID: HH-XXXX-XXXXXX
 */
export function format4PsMask(input: string): string {
  let cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleaned.startsWith('HH')) {
    cleaned = 'HH' + cleaned.replace(/^H+/, '');
  }
  cleaned = cleaned.slice(0, 14);

  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  } else {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
}

/**
 * Dynamic mask for 6-Digit DepEd School ID
 */
export function formatSchoolIdMask(input: string): string {
  return input.replace(/\D/g, '').slice(0, 6);
}
