import React, { useState } from 'react';
import {
  X,
  Download,
  Camera,
  Layers,
  Sparkles,
  Check,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Monitor,
  Copy,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import systemShowcaseImage from '../../assets/images/system_showcase_capture_1789941510863.jpg';

interface SystemCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetElementId?: string;
  currentScreenName?: string;
}

export const SystemCaptureModal: React.FC<SystemCaptureModalProps> = ({
  isOpen,
  onClose,
  targetElementId = 'root',
  currentScreenName = 'Active System View',
}) => {
  const [activeTab, setActiveTab] = useState<'showcase' | 'live'>('showcase');
  const [capturedLiveImage, setCapturedLiveImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Capture the live screen using html-to-image
  const handleCaptureLiveScreen = async () => {
    setIsCapturing(true);
    try {
      const node = document.getElementById(targetElementId) || document.body;
      const dataUrl = await toPng(node, {
        quality: 0.95,
        backgroundColor: '#f8f9fa',
        pixelRatio: 2,
        filter: (childNode) => {
          // Exclude this modal from the capture
          if (childNode instanceof HTMLElement && childNode.id === 'system-capture-modal') {
            return false;
          }
          return true;
        },
      });
      setCapturedLiveImage(dataUrl);
      setActiveTab('live');
    } catch (err) {
      console.error('Failed to capture screen:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div
      id="system-capture-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span>E-ENROLL System Picture Capture</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  HIGH DEFINITION
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Visual capture of the entire enrollment workflow, applicant portal & registrar platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              id="modal-download-capture-btn"
              onClick={() =>
                handleDownload(
                  activeTab === 'live' && capturedLiveImage
                    ? capturedLiveImage
                    : systemShowcaseImage,
                  activeTab === 'live' ? 'e-enroll-live-screen.png' : 'e-enroll-system-showcase.jpg'
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Picture</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation & Action Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-neutral-600">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ${
                activeTab === 'showcase'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Whole System Showcase</span>
            </button>
            <button
              onClick={() => {
                if (!capturedLiveImage) {
                  handleCaptureLiveScreen();
                } else {
                  setActiveTab('live');
                }
              }}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Live Screen Capture {capturedLiveImage ? '✓' : ''}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureLiveScreen}
              disabled={isCapturing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
            >
              <Camera className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
              <span>{isCapturing ? 'Capturing DOM...' : 'Snap Live Page'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Picture Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-950 flex flex-col items-center justify-center min-h-[420px]">
          {activeTab === 'showcase' ? (
            <div className="relative w-full flex items-center justify-center group">
              <img
                src={systemShowcaseImage}
                alt="E-ENROLL Whole System Capture"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl border border-neutral-800"
              />
              <div className="absolute bottom-4 inset-x-4 max-w-lg mx-auto bg-neutral-900/90 text-white backdrop-blur-md py-2 px-4 rounded-xl text-xs border border-neutral-700 flex items-center justify-between">
                <span className="font-semibold text-neutral-200">
                  Includes: Admissions, Applicant 11-Step Progress, Student Directory, Courses & Financials
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Full System
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full flex items-center justify-center">
              {capturedLiveImage ? (
                <img
                  src={capturedLiveImage}
                  alt="Live Screen Capture"
                  className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl border border-neutral-800"
                />
              ) : (
                <div className="text-center py-16 text-neutral-400 space-y-3">
                  <Camera className="w-12 h-12 mx-auto stroke-[1.25] text-neutral-600" />
                  <p className="text-sm">Click "Snap Live Page" to capture the live view directly.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* System Module Highlights Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <span className="font-bold text-neutral-900 block leading-tight">Admissions Roadmap</span>
              <span className="text-[10px] text-neutral-400">11-Step Milestone Tracking</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <span className="font-bold text-neutral-900 block leading-tight">Student Directory</span>
              <span className="text-[10px] text-neutral-400">Archival & Role Management</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <div>
              <span className="font-bold text-neutral-900 block leading-tight">Course Sections</span>
              <span className="text-[10px] text-neutral-400">Curriculum & Capacity Controls</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <div>
              <span className="font-bold text-neutral-900 block leading-tight">Financial & Billing</span>
              <span className="text-[10px] text-neutral-400">Invoicing, Tuitions & Receipts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
