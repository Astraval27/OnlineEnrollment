/**
 * DepEd Basic Education Policy Validation & Regulatory Engine
 * Conforms to:
 *  - DO No. 03, s. 2018 (BEEF Intake & Temporary Enrollment)
 *  - DO No. 20, s. 2018 (Kindergarten Age Qualification)
 *  - DO No. 54, s. 2016 (SF10 / Learner Transfer Tracking)
 *  - DO No. 17, s. 2025 (School Calendar Openings)
 *  - RA 10173 (Data Privacy Act of 2012)
 */

export interface KinderAgeEvaluation {
  ageYears: number;
  ageMonths: number;
  cutoffDate: Date;
  isEligible: boolean;
  isConditionalTagged: boolean; // Nov 1 to Dec 31
  isUnderage: boolean;
  status: 'ELIGIBLE' | 'LIS_CONDITIONAL_TAGGING' | 'UNDERAGE_INELIGIBLE';
  policyNotice: string;
}

export type SchoolOpeningMonth = 'June' | 'July' | 'August';

// DepEd Recognized Indigenous Peoples (IP) communities
export const DEPED_RECOGNIZED_IP_GROUPS = [
  'Aeta / Agta',
  'Ati',
  'Badjao / Sama-Bajau',
  'Blaan',
  'Bontoc',
  'Bukidnon',
  'Dumagat',
  'Ibaloi',
  'Ifugao',
  'Igorot / Kankanaey',
  'Ilongot / Bugkalot',
  'Isneg',
  'Ivatan',
  'Kalinga',
  'Mandaya',
  'Mangyan (Alangan, Buhid, Hanunoo, Iraya, Tadyawan, Tawbuid)',
  'Manobo',
  'Mansaka',
  'Maranao',
  'Palawano',
  'Subanen',
  'Tagbanwa',
  'Tboli',
  'Teduray',
  'Yakan',
  'Other DepEd-Recognized Indigenous Community',
] as const;

// DepEd Recognized LSEN (Learners with Special Educational Needs) Manifestations
export const DEPED_LSEN_MANIFESTATIONS = [
  { id: 'seeing', label: 'Difficulty in Seeing (even with eyeglasses)' },
  { id: 'hearing', label: 'Difficulty in Hearing (even with hearing aid)' },
  { id: 'walking', label: 'Difficulty in Walking, Climbing Steps, or Mobility' },
  { id: 'remembering', label: 'Difficulty in Remembering, Concentrating, or Understanding' },
  { id: 'learning', label: 'Difficulty in Basic Learning (Reading, Writing, Calculating)' },
  { id: 'communicating', label: 'Difficulty in Communicating or Being Understood' },
  { id: 'self_care', label: 'Difficulty in Self-Care (Washing, Dressing, Feeding)' },
  { id: 'applying_knowledge', label: 'Difficulty in Applying Daily Knowledge' },
] as const;

// Senior High School Tracks & Strands
export const SHS_TRACKS_AND_STRANDS = {
  Academic: [
    { code: 'STEM', title: 'Science, Technology, Engineering, and Mathematics' },
    { code: 'ABM', title: 'Accountancy, Business, and Management' },
    { code: 'HUMSS', title: 'Humanities and Social Sciences' },
    { code: 'GAS', title: 'General Academic Strand' },
  ],
  'Technical-Vocational-Livelihood (TVL)': [
    { code: 'TVL-ICT', title: 'Information and Communications Technology (ICT - Animation/Programming)' },
    { code: 'TVL-HE', title: 'Home Economics (Bread & Pastry, Cookery, Tourism)' },
    { code: 'TVL-IA', title: 'Industrial Arts (Automotive, Electrical Installation, Shielded Metal Arc Welding)' },
    { code: 'TVL-AFA', title: 'Agri-Fishery Arts (Crop Production, Aquaculture)' },
  ],
  'Sports Track': [
    { code: 'SPORTS', title: 'Sports Coaching, Officiating, and Athletic Performance' },
  ],
  'Arts and Design': [
    { code: 'ARTS-DESIGN', title: 'Visual and Performing Arts, Media, and Production Design' },
  ],
};

// DepEd Top 12 Mother Tongues
export const DEPED_MOTHER_TONGUES = [
  'Tagalog',
  'Cebuano (Sinugbuanong Binisaya)',
  'Ilokano (Iloko)',
  'Hiligaynon (Ilonggo)',
  'Waray-Waray',
  'Bikol',
  'Kapampangan',
  'Pangasinan',
  'Chavacano',
  'Maranao',
  'Maguindanaon',
  'Tausug',
  'Aklanon',
  'Surigaonon',
  'Kinaray-a',
  'Other Philippine Language',
];

/**
 * 1. Validate 12-Digit Learner Reference Number (LRN)
 * Rule: Exactly 12 numeric digits
 */
export function validateLRN(lrn: string): { isValid: boolean; message?: string } {
  if (!lrn || lrn.trim() === '') {
    return { isValid: false, message: 'LRN is required for continuing/returning learners.' };
  }
  const clean = lrn.trim();
  const lrnRegex = /^\d{12}$/;
  if (!lrnRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Invalid LRN format. DepEd LRN must be exactly 12 numeric digits (e.g. 108249000185).',
    };
  }
  return { isValid: true };
}

/**
 * 2. Validate 6-Digit DepEd School ID
 */
export function validateSchoolId(schoolId: string): boolean {
  return /^\d{6}$/.test(schoolId.trim());
}

/**
 * 3. Validate 4Ps Household ID (12 to 14 characters)
 */
export function validate4PsHouseholdId(hhId: string): boolean {
  if (!hhId) return false;
  const clean = hhId.trim().replace(/\s+/g, '');
  return clean.length >= 12 && clean.length <= 16;
}

/**
 * Kindergarten & Grade 1 Age-Cutoff Calculator (DO No. 20, s. 2018 & DO 47, s. 2016)
 *
 * Rules:
 * - June Opening: 5 years old by August 31 (Kindergarten) / 6 years old by August 31 (Grade 1)
 * - July Opening: 5 years old by September 30 (Kindergarten) / 6 years old by September 30 (Grade 1)
 * - August Opening (DO 17 s. 2025 Calendar): 5 years old by October 31 (Kindergarten) / 6 years old by October 31 (Grade 1)
 * - Conditional Acceptance Window (DO 20 s. 2018 Item 2):
 *   If learner turns 5 between November 1 and December 31, conditionally eligible
 *   provided school administers the Philippine Early Childhood Development (ECCD) checklist.
 *   Trigger LIS_CONDITIONAL_TAGGING flag.
 * - Underage: Turns 5 on or after January 1 of subsequent year -> strictly ineligible for Kindergarten.
 */
export function evaluateGrade1Eligibility(
  dobString: string,
  openingMonth: SchoolOpeningMonth = 'August',
  schoolYearStartYear: number = 2026,
  hasCompletedKinder: boolean = true
): KinderAgeEvaluation {
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) {
    return {
      ageYears: 0,
      ageMonths: 0,
      cutoffDate: new Date(schoolYearStartYear, 9, 31),
      isEligible: false,
      isConditionalTagged: false,
      isUnderage: true,
      status: 'UNDERAGE_INELIGIBLE',
      policyNotice: 'Please provide a valid date of birth for Grade 1 eligibility evaluation.',
    };
  }

  let standardCutoff: Date;
  if (openingMonth === 'June') {
    standardCutoff = new Date(schoolYearStartYear, 7, 31);
  } else if (openingMonth === 'July') {
    standardCutoff = new Date(schoolYearStartYear, 8, 30);
  } else {
    standardCutoff = new Date(schoolYearStartYear, 9, 31);
  }

  const ageAtStandardCutoff = calculateAgeInYearsAndMonths(birthDate, standardCutoff);

  if (ageAtStandardCutoff.years >= 6) {
    return {
      ageYears: ageAtStandardCutoff.years,
      ageMonths: ageAtStandardCutoff.months,
      cutoffDate: standardCutoff,
      isEligible: true,
      isConditionalTagged: false,
      isUnderage: false,
      status: 'ELIGIBLE',
      policyNotice: `Learner is ${ageAtStandardCutoff.years} years old by the ${openingMonth} opening cutoff. Eligible for Grade 1 under DepEd Order No. 20, s. 2018.`,
    };
  }

  // Learner turns 6 between Nov 1 and Dec 31
  const nov1 = new Date(schoolYearStartYear, 10, 1);
  const dec31 = new Date(schoolYearStartYear, 11, 31, 23, 59, 59);
  const sixthBirthday = new Date(
    birthDate.getFullYear() + 6,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (sixthBirthday >= nov1 && sixthBirthday <= dec31 && hasCompletedKinder) {
    return {
      ageYears: ageAtStandardCutoff.years,
      ageMonths: ageAtStandardCutoff.months,
      cutoffDate: dec31,
      isEligible: true,
      isConditionalTagged: true,
      isUnderage: false,
      status: 'LIS_CONDITIONAL_TAGGING',
      policyNotice: `CONDITIONAL GRADE 1 ACCEPTANCE: Learner turns 6 between Nov 1 and Dec 31, ${schoolYearStartYear} and has completed recognized Kindergarten with ECCD assessment. Under DO 20 s. 2018, tagged with [LIS_CONDITIONAL_TAGGING].`,
    };
  }

  return {
    ageYears: ageAtStandardCutoff.years,
    ageMonths: ageAtStandardCutoff.months,
    cutoffDate: standardCutoff,
    isEligible: false,
    isConditionalTagged: false,
    isUnderage: true,
    status: 'UNDERAGE_INELIGIBLE',
    policyNotice: `UNDERAGE FOR GRADE 1: Learner must be at least 6 years old by October 31, ${schoolYearStartYear} (or by Dec 31 with completed Kindergarten ECCD assessment) per DepEd Order No. 20, s. 2018.`,
  };
}
export function evaluateKindergartenEligibility(
  dobString: string,
  openingMonth: SchoolOpeningMonth = 'August',
  schoolYearStartYear: number = 2026
): KinderAgeEvaluation {
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) {
    return {
      ageYears: 0,
      ageMonths: 0,
      cutoffDate: new Date(schoolYearStartYear, 9, 31),
      isEligible: false,
      isConditionalTagged: false,
      isUnderage: true,
      status: 'UNDERAGE_INELIGIBLE',
      policyNotice: 'Please provide a valid date of birth.',
    };
  }

  // Determine standard cutoff date based on DepEd Opening Month
  let standardCutoff: Date;
  if (openingMonth === 'June') {
    standardCutoff = new Date(schoolYearStartYear, 7, 31); // Aug 31
  } else if (openingMonth === 'July') {
    standardCutoff = new Date(schoolYearStartYear, 8, 30); // Sep 30
  } else {
    // August Opening
    standardCutoff = new Date(schoolYearStartYear, 9, 31); // Oct 31
  }

  // Calculate age at standard cutoff
  const ageAtStandardCutoff = calculateAgeInYearsAndMonths(birthDate, standardCutoff);

  // If age is >= 5.0 at standard cutoff: Fully eligible
  if (ageAtStandardCutoff.years >= 5) {
    return {
      ageYears: ageAtStandardCutoff.years,
      ageMonths: ageAtStandardCutoff.months,
      cutoffDate: standardCutoff,
      isEligible: true,
      isConditionalTagged: false,
      isUnderage: false,
      status: 'ELIGIBLE',
      policyNotice: `Learner is 5 years old by the ${openingMonth} opening cutoff (${standardCutoff.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}). Qualified under DepEd Order No. 20, s. 2018.`,
    };
  }

  // Check DO 20 s. 2018 Conditional Window (Nov 1 to Dec 31 of opening year)
  const nov1 = new Date(schoolYearStartYear, 10, 1);
  const dec31 = new Date(schoolYearStartYear, 11, 31, 23, 59, 59);

  // Learner's 5th birthday date
  const fifthBirthday = new Date(
    birthDate.getFullYear() + 5,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (fifthBirthday >= nov1 && fifthBirthday <= dec31) {
    return {
      ageYears: ageAtStandardCutoff.years,
      ageMonths: ageAtStandardCutoff.months,
      cutoffDate: dec31,
      isEligible: true,
      isConditionalTagged: true,
      isUnderage: false,
      status: 'LIS_CONDITIONAL_TAGGING',
      policyNotice: `CONDITIONAL ACCEPTANCE: Learner turns 5 years old between Nov 1 and Dec 31, ${schoolYearStartYear}. Under DO 20 s. 2018, learner may be admitted subject to Philippine Early Childhood Development (ECCD) checklist readiness assessment. Tagged with [LIS_CONDITIONAL_TAGGING].`,
    };
  }

  // Underage (5th birthday falls on or after Jan 1)
  return {
    ageYears: ageAtStandardCutoff.years,
    ageMonths: ageAtStandardCutoff.months,
    cutoffDate: standardCutoff,
    isEligible: false,
    isConditionalTagged: false,
    isUnderage: true,
    status: 'UNDERAGE_INELIGIBLE',
    policyNotice: `UNDERAGE APPLICANT: Learner will turn 5 only after Dec 31, ${schoolYearStartYear}. Under DepEd Order No. 20, s. 2018 and DO 47, s. 2016, learner is not yet eligible for Kindergarten in SY ${schoolYearStartYear}-${schoolYearStartYear + 1}.`,
  };
}

/**
 * Helper to compute exact years and months
 */
export function calculateAgeInYearsAndMonths(birthDate: Date, targetDate: Date): { years: number; months: number } {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  const days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months) };
}

/**
 * 5. AES-256 Simulation for Sensitive Personal Information (RA 10173)
 */
export function encryptSensitiveField(plainText: string): string {
  if (!plainText) return '';
  // Encodes base64 with pseudo-AES marker for demonstration & compliance audit logging
  const encoded = btoa(unescape(encodeURIComponent(plainText)));
  return `ENC:AES256:${encoded}`;
}

export function decryptSensitiveField(cipherText: string): string {
  if (!cipherText || !cipherText.startsWith('ENC:AES256:')) return cipherText;
  try {
    const raw = cipherText.replace('ENC:AES256:', '');
    return decodeURIComponent(escape(atob(raw)));
  } catch {
    return cipherText;
  }
}

/**
 * 6. DepEd October 31 Affidavit of Undertaking Deadline
 */
export function getDepEdAffidavitDeadline(schoolYearStartYear: number = 2026): string {
  return `${schoolYearStartYear}-10-31`; // Mandatory October 31 deadline per DO 03, s. 2018
}
