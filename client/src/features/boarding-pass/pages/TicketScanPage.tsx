import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCode,
  Upload,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { decodeQRImage, BoardingPassData } from '../utils/qrDecoder';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../../shared/context/LanguageContext';

interface TicketScanPageProps {
  onScanComplete?: (data: BoardingPassData) => void;
}

const SAMPLE_TICKETS: BoardingPassData[] = [
  {
    ticket_id: 'TKT-892147',
    passenger_name: 'Sai Venkat',
    flight_id: 'AI-102',
    date: '2026-08-12',
    from: 'HYD',
    to: 'DEL',
    terminal: 'Terminal 1',
    seat: '18A',
  },
  {
    ticket_id: 'TKT-449012',
    passenger_name: 'Ananya Sharma',
    flight_id: '6E-204',
    date: '2026-08-12',
    from: 'BLR',
    to: 'BOM',
    terminal: 'Terminal 2',
    seat: '12F',
  },
  {
    ticket_id: 'TKT-991823',
    passenger_name: 'Rahil Patel',
    flight_id: 'EK-501',
    date: '2026-08-12',
    from: 'DXB',
    to: 'LHR',
    terminal: 'Terminal 3',
    seat: '04K',
  },
];

export default function TicketScanPage({ onScanComplete }: TicketScanPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentLang, changeLanguage, getLanguageObj } = useLanguage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedSuccess, setScannedSuccess] = useState<BoardingPassData | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [manualTicket, setManualTicket] = useState({
    passenger_name: '',
    flight_id: '',
    ticket_id: '',
    from: 'HYD',
    to: 'DEL',
    terminal: 'Terminal 1',
    seat: '12A',
  });

  const currentLangObj = getLanguageObj();

  const handleSelectTicket = (data: BoardingPassData) => {
    sessionStorage.setItem('boardingData', JSON.stringify(data));
    sessionStorage.setItem('ticketScanned', 'true');
    setScannedSuccess(data);

    // Notify application that ticket has been scanned
    window.dispatchEvent(new Event('ticket-scanned-event'));

    setTimeout(() => {
      if (onScanComplete) {
        onScanComplete(data);
      } else {
        navigate('/');
      }
    }, 800);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setIsProcessing(true);
    setError(null);

    try {
      const data = await decodeQRImage(file);
      handleSelectTicket(data);
    } catch (err: any) {
      setError(err.message || 'Failed to scan QR code from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTicket.passenger_name || !manualTicket.flight_id) {
      setError('Please fill in passenger name and flight number');
      return;
    }

    const data: BoardingPassData = {
      ticket_id: manualTicket.ticket_id || `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      passenger_name: manualTicket.passenger_name,
      flight_id: manualTicket.flight_id.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      from: manualTicket.from || 'HYD',
      to: manualTicket.to || 'DEL',
      terminal: manualTicket.terminal || 'Terminal 1',
      seat: manualTicket.seat || '14B',
    };

    handleSelectTicket(data);
  };

  return (
    <div className="min-h-screen bg-[#06121F] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header Bar for Ticket Scanner */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F80FF] to-[#14C8FF] flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <div className="font-black text-lg text-white tracking-tight">AIRPORT APP</div>
            <div className="text-[10px] text-[#94A3B8] font-medium">Step 1: Boarding Pass & Ticket Verification</div>
          </div>
        </div>

        {/* Language Selector in Top Right Header */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13243B] hover:bg-[#1f3454] border border-white/15 text-xs font-bold text-white transition-all shadow-md"
          >
            <Globe className="w-4 h-4 text-[#14C8FF]" />
            <span className="text-[#14C8FF] uppercase text-xs">{currentLangObj.code}</span>
            <span className="hidden sm:inline text-slate-300 font-normal">{currentLangObj.nativeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {showLangDropdown && (
            <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-[#0E1B2D] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-white/10">
                Select Language
              </div>
              <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      lang.code === currentLang
                        ? 'bg-[#2F80FF]/25 text-[#14C8FF] font-bold border border-cyan-400/20'
                        : 'text-[#F8FAFC] hover:bg-white/10'
                    }`}
                  >
                    <span>{lang.nativeLabel} ({lang.label})</span>
                    {lang.code === currentLang && <span className="w-2 h-2 rounded-full bg-[#14C8FF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Ticket Scanner Body */}
      <main className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Banner Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-[#14C8FF] border border-blue-400/30 text-xs font-bold tracking-wider uppercase">
            <ShieldCheck size={14} />
            <span>TICKET SCANNING REQUIRED BEFORE HOME PAGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Scan Your Ticket to Proceed
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Please scan your QR code or select a verified ticket below. Once scanned, your personalized Home Dashboard will open automatically.
          </p>
        </div>

        {/* Success Banner */}
        {scannedSuccess && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-4 shadow-xl"
          >
            <CheckCircle2 size={36} className="shrink-0 text-emerald-400 animate-bounce" />
            <div>
              <div className="font-extrabold text-xl text-white">Ticket Verified Successfully!</div>
              <div className="text-sm text-emerald-200 mt-0.5">
                Welcome, {scannedSuccess.passenger_name} ({scannedSuccess.flight_id}). Opening Home Page…
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-300 flex items-center gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action: Upload QR */}
        <div className="flex flex-col justify-between p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0E1B2D] to-[#0A1524] border border-white/15 hover:border-cyan-400/50 transition-all shadow-2xl group max-w-2xl mx-auto w-full">
          <div className="space-y-4 text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <QrCode size={50} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Upload Ticket QR Image</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Upload your digital boarding pass or paper ticket QR photo
              </p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="mt-10 w-full py-4 px-6 bg-gradient-to-r from-[#2F80FF] via-[#1E6DFF] to-[#14C8FF] hover:from-blue-600 hover:to-cyan-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 text-base transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} />
                <span>Upload QR Image File</span>
              </>
            )}
          </button>
        </div>

        {/* Manual PNR Entry */}
        <div className="pt-4 border-t border-white/10">
          <details className="group">
            <summary className="cursor-pointer text-xs font-bold text-[#14C8FF] hover:underline flex items-center justify-between">
              <span>Or enter PNR / Ticket details manually</span>
              <span className="text-[#94A3B8] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <form onSubmit={handleManualSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Passenger Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={manualTicket.passenger_name}
                  onChange={(e) => setManualTicket({ ...manualTicket, passenger_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Flight Number</label>
                <input
                  type="text"
                  placeholder="e.g. AI-102 or 6E-204"
                  value={manualTicket.flight_id}
                  onChange={(e) => setManualTicket({ ...manualTicket, flight_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  Verify & Submit Ticket
                </button>
              </div>
            </form>
          </details>
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center text-xs text-[#94A3B8] py-2 border-t border-white/5">
        Airport App • Encrypted Terminal Control Center
      </footer>
    </div>
  );
}
