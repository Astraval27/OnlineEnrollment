import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock server middleware plugin for DepEd API Endpoints
function depedApiPlugin(): Plugin {
  return {
    name: 'deped-api-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
        res.setHeader('Content-Type', 'application/json');

        // GET /api/learners/query-lrn
        if (req.method === 'GET' && url.pathname === '/api/learners/query-lrn') {
          const lrn = url.searchParams.get('lrn');
          if (lrn === '108249000185') {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                success: true,
                found: true,
                autoFilledPercent: 72,
                data: {
                  lrn: '108249000185',
                  firstName: 'Johnny',
                  middleName: 'Mendoza',
                  lastName: 'Tabulo',
                  sex: 'Male',
                  birthDate: '2009-08-14',
                  motherTongue: 'Tagalog',
                  is4Ps: true,
                  fourPsHouseholdId: 'HH-1082-940185',
                  keyStage: 'Senior High',
                  gradeLevel: 'Grade 11',
                  trackStrand: 'STEM',
                  parentGuardianName: 'Roberto Tabulo',
                  parentGuardianContact: '+63 917 555 0199',
                },
              })
            );
          }
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              found: false,
              message: 'LRN valid. No prior registry entry.',
            })
          );
        }

        // POST /api/enrollment/submit
        if (req.method === 'POST' && url.pathname === '/api/enrollment/submit') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const isMissingDocs = !payload.hasPSABirthCert || !payload.hasSF9ReportCard;
              const status = isMissingDocs ? 'TEMPORARILY_ENROLLED' : 'VERIFIED_COMPLETE';
              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  applicationId: `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
                  status,
                  mandatoryDeadline: isMissingDocs ? '2026-10-31' : undefined,
                  provisionalSlipCode: isMissingDocs ? `DEPED-PROV-${Date.now().toString(36).toUpperCase()}` : undefined,
                  message: isMissingDocs
                    ? 'Application accepted under TEMPORARY ENROLLMENT (DO 03, s. 2018). Mandatory deadline October 31, 2026.'
                    : 'Enrollment application verified and accepted.',
                })
              );
            } catch {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'INVALID_JSON' }));
            }
          });
          return;
        }

        // POST /api/enrollment/affidavit
        if (req.method === 'POST' && url.pathname === '/api/enrollment/affidavit') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                success: true,
                affidavitId: `AOU-${Date.now()}`,
                barcode: `DEPED-AOU-${Date.now().toString(36).toUpperCase()}`,
                status: 'TEMPORARILY_ENROLLED',
                mandatoryDeadline: '2026-10-31',
              })
            );
          });
          return;
        }

        // GET /api/admin/export/lis
        if (req.method === 'GET' && url.pathname === '/api/admin/export/lis') {
          const format = url.searchParams.get('format') || 'json';
          if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.statusCode = 200;
            return res.end(
              'Record_ID,LRN,Learner_Name,Grade_Level,Section,Track_Strand,Status,School_ID,School_Year\n' +
                '1,"108249000185","Johnny Tabulo","Grade 11","STEM-A","STEM","OFFICIAL_ENROLLED","300481","2026-2027"\n'
            );
          }
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              system: 'DepEd Learner Information System (LIS) BOSY Module',
              schoolId: '300481',
              schoolYear: '2026-2027',
              recordsCount: 1,
            })
          );
        }

        // POST /api/admission/register (Scenario 2: Guest admission + account creation + initial BEEF)
        if (req.method === 'POST' && url.pathname === '/api/admission/register') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const isMissingDocs = !payload.hasPSABirthCert || !payload.hasSF9ReportCard;
              const status = isMissingDocs ? 'TEMPORARILY_ENROLLED' : 'SUBMITTED';
              const appId = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
              const tempId = payload.pathway === 'new_student' ? `TEMP-2026-${Math.floor(100000 + Math.random() * 900000)}` : undefined;
              const lrn = payload.lrn || undefined;
              const parentMobile = payload.parentMobile || '+63 917 555 0199';
              const parentEmail = payload.parentEmail || 'parent@e-enroll.edu';

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  message: isMissingDocs
                    ? 'Guest Admission complete! Temporary enrollment granted under DO 03, s. 2018 with deadline Oct 31, 2026.'
                    : 'Guest Admission complete! Student portal account credentials created.',
                  applicationId: appId,
                  tempReferenceId: tempId,
                  lrn: lrn,
                  user: {
                    id: `usr_${Date.now()}`,
                    email: parentEmail,
                    mobileNumber: parentMobile,
                    parentName: payload.parentName || 'Parent / Legal Guardian',
                    role: 'student',
                    lrn,
                    tempReferenceId: tempId,
                    isEmailVerified: false,
                    isMobileVerified: true,
                    createdAt: new Date().toISOString(),
                  },
                  learner: {
                    id: `lrn_${Date.now()}`,
                    name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Learner Applicant',
                    gradeLevel: payload.gradeLevel || 'Grade 11',
                    trackStrand: payload.trackStrand || 'STEM',
                    lrnOrTempId: lrn || tempId || 'TEMP-2026-000000',
                    department: payload.gradeLevel?.includes('Grade 11') || payload.gradeLevel?.includes('Grade 12')
                      ? 'Senior High School'
                      : payload.gradeLevel === 'Kindergarten'
                      ? 'Kindergarten'
                      : 'Elementary / Junior High',
                  },
                  roadmap: {
                    applicationId: appId,
                    currentStep: isMissingDocs ? 5 : 6,
                    totalSteps: 11,
                    status,
                    sf10Tracking: payload.pathway === 'transferee' ? {
                      requested: true,
                      trackingCode: `SF10-REQ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
                      originSchoolName: payload.previousSchoolName || 'Origin DepEd School',
                      originSchoolId: payload.previousSchoolId || '300481',
                      status: 'DISPATCHED_TO_ORIGIN_SCHOOL',
                    } : undefined,
                  },
                  verification: {
                    emailSent: true,
                    smsSent: true,
                    smsCode: Math.floor(100000 + Math.random() * 900000).toString(),
                    smsRecipient: parentMobile,
                    emailRecipient: parentEmail,
                  },
                })
              );
            } catch {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'INVALID_JSON_PAYLOAD' }));
            }
          });
          return;
        }

        // GET /api/student/enrollment-status (Scenario 2: Fetches current roadmap step for logged-in students)
        if (req.method === 'GET' && url.pathname === '/api/student/enrollment-status') {
          const lrn = url.searchParams.get('lrn');
          const tempId = url.searchParams.get('tempId');
          const activeIdentifier = lrn || tempId || '109283746512';

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              applicationId: 'APP-2026-004912',
              identifier: activeIdentifier,
              roadmap: {
                applicationId: 'APP-2026-004912',
                currentStep: 5,
                totalSteps: 11,
                status: 'UNDER_REVIEW',
                statusLabel: 'STEP 5: SF9 VERIFICATION',
                missingDocuments: ['SF9_REPORT_CARD'],
                provisionalDeadline: '2026-10-31',
                sf10Tracking: {
                  requested: true,
                  trackingCode: 'SF10-REQ-2026-948122',
                  originSchoolName: 'Pasig City Science High School',
                  originSchoolId: '300481',
                  status: 'DISPATCHED_TO_ORIGIN_SCHOOL',
                },
              },
            })
          );
        }

        // PUT /api/student/enrollment-update (Scenario 2: Submits updated BEEF data and document uploads/affidavits)
        if (req.method === 'PUT' && url.pathname === '/api/student/enrollment-update') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  message: 'Enrollment progress and credentials updated successfully.',
                  applicationId: payload.applicationId || 'APP-2026-004912',
                  currentStep: payload.documentUpload || payload.affidavit ? 6 : 5,
                  status: payload.affidavit ? 'TEMPORARILY_ENROLLED' : 'VERIFIED_COMPLETE',
                })
              );
            } catch {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'INVALID_JSON_PAYLOAD' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), depedApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
