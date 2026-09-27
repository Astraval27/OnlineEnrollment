import React, { useState, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Bell,
  Activity,
  User,
  ShieldCheck,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, normalizeRole } from '../../data/roles';

interface UserProfileSettingsProps {
  currentRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onSave?: () => void;
}

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  currentRole = 'student',
  onChangeRole,
}) => {
  const activeRole = normalizeRole(currentRole);
  const roleConfig = ROLE_CONFIGS[activeRole];

  const [activeTab, setActiveTab] = useState<
    'General Profile' | 'Security & Password' | 'Notifications' | 'System Audit Log'
  >('General Profile');

  // Form states initialized according to active role
  const [firstName, setFirstName] = useState(activeRole === 'student' ? 'Johnny' : activeRole === 'registrar' ? 'Maria' : 'Elena');
  const [lastName, setLastName] = useState(activeRole === 'student' ? 'Tabulo' : activeRole === 'registrar' ? 'Santos' : 'Rivera');
  const [email, setEmail] = useState(roleConfig.email);
  const [idNumber, setIdNumber] = useState(roleConfig.idNumber);
  const [department, setDepartment] = useState(roleConfig.department);
  const [bio, setBio] = useState(roleConfig.roleDescription);

  // Sync when activeRole changes
  useEffect(() => {
    const config = ROLE_CONFIGS[activeRole];
    if (activeRole === 'student') {
      setFirstName('Johnny');
      setLastName('Tabulo');
    } else if (activeRole === 'registrar') {
      setFirstName('Maria');
      setLastName('Santos');
    } else {
      setFirstName('Elena');
      setLastName('Rivera');
    }
    setEmail(config.email);
    setIdNumber(config.idNumber);
    setDepartment(config.department);
    setBio(config.roleDescription);
  }, [activeRole]);

  // Preference states
  const [autoDarkMode, setAutoDarkMode] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);
  const [timezone, setTimezone] = useState('UTC+8 (Manila)');
  const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const handleSave = () => {
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {saveSuccessToast && (
        <div className="bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Profile & system preferences updated successfully!</span>
          </div>
          <button onClick={() => setSaveSuccessToast(false)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Subnav Tabs and Role Switcher Card */}
        <div className="space-y-4">
          {/* Active Role Card */}
          <div className={`p-4 rounded-xl border ${roleConfig.colorScheme.bg} ${roleConfig.colorScheme.border} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                ACTIVE ACCOUNT
              </span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${roleConfig.colorScheme.badge}`}>
                {roleConfig.badgeLabel}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">{roleConfig.name}</p>
              <p className="text-[11px] text-neutral-600 font-mono">{roleConfig.idNumber}</p>
              <p className="text-[11px] text-neutral-500 leading-snug mt-1">{roleConfig.department}</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { name: 'General Profile', icon: User },
              { name: 'Security & Password', icon: Lock },
              { name: 'Notifications', icon: Bell },
              { name: 'System Audit Log', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  id={`tab-settings-${tab.name.toLowerCase().replace(/ & | /g, '-')}`}
                  onClick={() => setActiveTab(tab.name as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight text-left transition-colors ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-xs border border-slate-200'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'General Profile' && (
            <>
              {/* Profile Information Card */}
              <div
                id="profile-info-card"
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6"
              >
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Profile Information
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Manage your identity details, department assignments, and system authorization.
                  </p>
                </div>

                {/* Avatar and User details header */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden font-bold text-lg text-neutral-700">
                      {firstName.charAt(0)}{lastName.charAt(0)}
                    </div>
                    <button
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow hover:bg-neutral-800 transition-colors"
                      title="Upload Avatar"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-neutral-900">
                        {firstName} {lastName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleConfig.colorScheme.badge}`}>
                        {roleConfig.badgeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {department}
                    </p>
                    <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1 block">
                      ID: {idNumber} • ACTIVE SYSTEM USER
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                        FIRST NAME
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                        LAST NAME
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                        {activeRole === 'student' ? 'LEARNER REFERENCE NO. (LRN)' : 'DEPED EMPLOYEE ID'}
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                      {activeRole === 'student' ? 'GRADE LEVEL & ACADEMIC TRACK / STRAND' : 'ACADEMIC DEPARTMENT / OFFICE'}
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5">
                      {activeRole === 'student' ? 'ACADEMIC NOTES & GOALS' : 'INSTITUTIONAL RESPONSIBILITIES'}
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A brief description of your role..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-none"
                    />
                  </div>

                  {/* Role Permissions Matrix Card */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block">
                      Assigned Role Capabilities & Access:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {roleConfig.allowedScreens.map((screen) => (
                        <span
                          key={screen}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-neutral-700 shadow-2xs"
                        >
                          ✓ {screen.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Preferences Card */}
              <div
                id="system-preferences-card"
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6"
              >
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    System Preferences
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Configure your workspace environment.
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {/* Automatic Dark Mode */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Automatic Dark Mode
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Sync with your system settings.
                      </p>
                    </div>
                    <button
                      id="toggle-dark-mode"
                      onClick={() => setAutoDarkMode(!autoDarkMode)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        autoDarkMode ? 'bg-neutral-900' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          autoDarkMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Digest */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Email Digest
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Receive a daily summary of application updates.
                      </p>
                    </div>
                    <button
                      id="toggle-email-digest"
                      onClick={() => setEmailDigest(!emailDigest)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        emailDigest ? 'bg-neutral-900' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          emailDigest ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Default Timezone */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Default Timezone
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Currently set to {timezone}.
                      </p>
                    </div>
                    {showTimezoneSelect ? (
                      <select
                        value={timezone}
                        onChange={(e) => {
                          setTimezone(e.target.value);
                          setShowTimezoneSelect(false);
                        }}
                        className="text-xs border border-slate-300 rounded px-2 py-1"
                      >
                        <option value="UTC+8 (Manila)">UTC+8 (Manila)</option>
                        <option value="UTC+0 (London)">UTC+0 (London)</option>
                        <option value="UTC-5 (New York)">UTC-5 (New York)</option>
                        <option value="UTC+9 (Tokyo)">UTC+9 (Tokyo)</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => setShowTimezoneSelect(true)}
                        className="text-xs font-bold text-neutral-900 hover:underline uppercase tracking-wider"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status Card */}
              <div
                id="account-status-card"
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4"
              >
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Account Status
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Deactivate Account
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      This will temporarily disable your access to the registrar portal.
                    </p>
                  </div>

                  <button
                    id="btn-request-deactivation"
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-neutral-800 hover:bg-slate-50 uppercase tracking-wider transition-colors shrink-0"
                  >
                    REQUEST DEACTIVATION
                  </button>
                </div>
              </div>

              {/* Save changes footer bar */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab === 'Security & Password' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-neutral-900">Security & Password</h3>
              <p className="text-xs text-neutral-500">Update your multi-factor authentication and passwords.</p>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 border border-slate-200 rounded text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 border border-slate-200 rounded text-xs" />
                </div>
                <button onClick={handleSave} className="py-2 px-4 bg-neutral-900 text-white rounded text-xs font-bold uppercase">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-neutral-900">Notification Channels</h3>
              <p className="text-xs text-neutral-500">Configure SMS, in-app alerts, and registrar escalation alerts.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                  <span>Student Application Submission SMS Alerts</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" defaultChecked className="rounded text-neutral-900" />
                  <span>Tuition Payment Settlement Notifications</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'System Audit Log' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-neutral-900">System Audit Log</h3>
              <div className="text-xs divide-y divide-slate-100 font-mono">
                <div className="py-2 flex justify-between">
                  <span>[LOGIN_SUCCESS] Admin User</span>
                  <span className="text-neutral-400">Oct 20, 2026 12:45 PM</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>[DOCUMENT_APPROVED] ID_Proof_Sarah_M</span>
                  <span className="text-neutral-400">Oct 19, 2026 04:12 PM</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>[INVOICE_GENERATED] TRX-99821</span>
                  <span className="text-neutral-400">Oct 19, 2026 09:30 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deactivation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Deactivation Request</span>
            </div>
            <p className="text-xs text-neutral-600">
              Are you sure you want to request deactivation for ID <span className="font-bold">{idNumber}</span>? An authorization notification will be dispatched to the system dean.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Deactivation request dispatched to Super Administrator.');
                  setShowDeactivateModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold uppercase"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
