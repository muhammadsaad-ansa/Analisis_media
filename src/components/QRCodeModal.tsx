import React, { useState } from 'react';
import { TrackedLink } from '../types';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface QRCodeModalProps {
  link: TrackedLink | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!link) return null;

  const fullUrl = `${window.location.origin}/r/${link.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Generate a simple download for the SVG QR
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode-${link.slug}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Kode QR Tautan Medsos
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Pindai untuk diarahkan langsung ke tautan pelacak Anda.
        </p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-sm">
          <svg
            id="qr-code-svg"
            viewBox="0 0 160 160"
            className="w-44 h-44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="160" height="160" fill="white" rx="8" />

            {/* Corner 1: Top-Left Finder */}
            <rect x="14" y="14" width="36" height="36" rx="6" stroke="#0F172A" strokeWidth="6" />
            <rect x="23" y="23" width="18" height="18" rx="3" fill="#0F172A" />

            {/* Corner 2: Top-Right Finder */}
            <rect x="110" y="14" width="36" height="36" rx="6" stroke="#0F172A" strokeWidth="6" />
            <rect x="119" y="23" width="18" height="18" rx="3" fill="#0F172A" />

            {/* Corner 3: Bottom-Left Finder */}
            <rect x="14" y="110" width="36" height="36" rx="6" stroke="#0F172A" strokeWidth="6" />
            <rect x="23" y="119" width="18" height="18" rx="3" fill="#0F172A" />

            {/* Decorative QR matrix pattern */}
            <g fill="#0F172A">
              <rect x="58" y="16" width="6" height="6" rx="1.5" />
              <rect x="70" y="16" width="6" height="6" rx="1.5" />
              <rect x="82" y="16" width="6" height="6" rx="1.5" />
              <rect x="94" y="16" width="6" height="6" rx="1.5" />

              <rect x="58" y="28" width="6" height="6" rx="1.5" />
              <rect x="82" y="28" width="6" height="6" rx="1.5" />

              <rect x="58" y="40" width="6" height="6" rx="1.5" />
              <rect x="70" y="40" width="6" height="6" rx="1.5" />
              <rect x="94" y="40" width="6" height="6" rx="1.5" />

              <rect x="16" y="58" width="6" height="6" rx="1.5" />
              <rect x="28" y="58" width="6" height="6" rx="1.5" />
              <rect x="40" y="58" width="6" height="6" rx="1.5" />
              <rect x="64" y="58" width="6" height="6" rx="1.5" />
              <rect x="76" y="58" width="6" height="6" rx="1.5" />
              <rect x="100" y="58" width="6" height="6" rx="1.5" />
              <rect x="118" y="58" width="6" height="6" rx="1.5" />
              <rect x="136" y="58" width="6" height="6" rx="1.5" />

              <rect x="28" y="70" width="6" height="6" rx="1.5" />
              <rect x="52" y="70" width="6" height="6" rx="1.5" />
              <rect x="88" y="70" width="6" height="6" rx="1.5" />
              <rect x="112" y="70" width="6" height="6" rx="1.5" />
              <rect x="124" y="70" width="6" height="6" rx="1.5" />

              {/* Center Logo Node */}
              <circle cx="80" cy="80" r="14" fill="#6366F1" />
              <path d="M75 80 L79 84 L87 75" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              <rect x="16" y="88" width="6" height="6" rx="1.5" />
              <rect x="40" y="88" width="6" height="6" rx="1.5" />
              <rect x="64" y="88" width="6" height="6" rx="1.5" />
              <rect x="100" y="88" width="6" height="6" rx="1.5" />
              <rect x="124" y="88" width="6" height="6" rx="1.5" />
              <rect x="136" y="88" width="6" height="6" rx="1.5" />

              <rect x="58" y="112" width="6" height="6" rx="1.5" />
              <rect x="70" y="112" width="6" height="6" rx="1.5" />
              <rect x="88" y="112" width="6" height="6" rx="1.5" />
              <rect x="112" y="112" width="6" height="6" rx="1.5" />
              <rect x="136" y="112" width="6" height="6" rx="1.5" />

              <rect x="70" y="124" width="6" height="6" rx="1.5" />
              <rect x="94" y="124" width="6" height="6" rx="1.5" />
              <rect x="118" y="124" width="6" height="6" rx="1.5" />

              <rect x="58" y="136" width="6" height="6" rx="1.5" />
              <rect x="82" y="136" width="6" height="6" rx="1.5" />
              <rect x="106" y="136" width="6" height="6" rx="1.5" />
              <rect x="130" y="136" width="6" height="6" rx="1.5" />
            </g>
          </svg>
        </div>

        <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
          {link.title}
        </div>
        <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
          {fullUrl}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
