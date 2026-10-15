import React, { useState } from 'react';
import {
  Plane,
  Building,
  Ticket,
  Train,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Plus,
  X,
  CheckCircle,
  Copy,
  Wifi,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { DigitalPass } from '../types/travel.ts';

interface DigitalPassWalletProps {
  passes: DigitalPass[];
  onAddPass?: (pass: DigitalPass) => void;
  destinationName: string;
}

export const DigitalPassWallet: React.FC<DigitalPassWalletProps> = ({
  passes,
  onAddPass,
  destinationName,
}) => {
  const [selectedPass, setSelectedPass] = useState<DigitalPass | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPassType, setNewPassType] = useState<DigitalPass['type']>('attraction');
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newRefCode, setNewRefCode] = useState('');

  const getPassIcon = (type: DigitalPass['type']) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Building;
      case 'attraction':
        return Ticket;
      case 'transit':
        return Train;
      case 'insurance':
        return ShieldCheck;
      default:
        return Ticket;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProvider.trim()) return;

    const newPass: DigitalPass = {
      id: `pass-custom-${Date.now()}`,
      type: newPassType,
      title: newTitle,
      provider: newProvider,
      referenceCode: newRefCode || `TC-${Math.floor(100000 + Math.random() * 900000)}`,
      holderName: 'Valued Traveler',
      validDate: 'Active for this trip',
      details: {
        Category: newPassType.toUpperCase(),
        Verification: 'Confirmed & Guaranteed',
        IssuedBy: 'Trip.com Singapore Partner',
      },
      status: 'active',
      qrCodeValue: `TC-PASS-${Date.now()}`,
      accentColor: newPassType === 'flight' ? 'indigo' : 'emerald',
    };

    if (onAddPass) onAddPass(newPass);
    setShowAddModal(false);
    setNewTitle('');
    setNewProvider('');
    setNewRefCode('');
  };

  const filteredPasses = passes.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Ticket className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              My Bookings & Digital Pass Wallet
            </h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
              {passes.length} Passes Confirmed
            </span>
          </div>
          <p className="text-xs text-slate-500">
            SmartTravel.com integrated wallet: Airline boarding pass, Hotel smart lock voucher, Attraction FastPasses, Subway QR code, and Allianz Travel Shield.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Booking</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (All, Flights, Hotels, Attractions, Transit, Insurance) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'all', label: 'All Passes', count: passes.length },
          { id: 'flight', label: 'Flights', count: passes.filter((p) => p.type === 'flight').length },
          { id: 'hotel', label: 'Hotels & Airbnb', count: passes.filter((p) => p.type === 'hotel').length },
          { id: 'attraction', label: 'Attractions & Tours', count: passes.filter((p) => p.type === 'attraction').length },
          { id: 'transit', label: 'Transit & Rail', count: passes.filter((p) => p.type === 'transit').length },
          { id: 'insurance', label: 'Allianz Insurance', count: passes.filter((p) => p.type === 'insurance').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPasses.map((pass) => {
          const Icon = getPassIcon(pass.type);

          return (
            <div
              key={pass.id}
              onClick={() => setSelectedPass(pass)}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Pass Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pass.type} Pass</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {pass.referenceCode}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition mb-0.5">
                  {pass.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {pass.provider}
                </p>

                {/* Key metadata grid */}
                <div className="bg-slate-50 rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs mb-3 border border-slate-100">
                  {Object.entries(pass.details).slice(0, 4).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                        {key}
                      </span>
                      <span className="font-bold text-slate-800 truncate block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom scan trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Valid: <strong className="text-slate-800">{pass.validDate}</strong>
                </span>

                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-bold text-xs">
                  <QrCode className="w-4 h-4" />
                  <span>Scan e-Ticket</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Screen Digital Pass Modal (Simulates Trip.com E-Ticket View) */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
                {React.createElement(getPassIcon(selectedPass.type), { className: 'w-7 h-7' })}
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                Official SmartTravel.com E-Ticket & Pass
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {selectedPass.title}
              </h3>
              <p className="text-xs text-slate-500">{selectedPass.provider}</p>
            </div>

            {/* QR Code Presentation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-white border border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner relative">
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 p-1 bg-white rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        i % 2 === 0 || i % 5 === 0 || i < 7 || i > 28
                          ? 'bg-slate-900'
                          : 'bg-transparent'
                      } rounded-[2px]`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <p className="text-xs font-mono font-bold text-slate-900 mt-3 tracking-widest">
                {selectedPass.referenceCode}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scan at turnstile, airline boarding gate, or hotel kiosk
              </p>
            </div>

            {/* Metadata list */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Traveler:</span>
                <span className="font-bold text-slate-900">{selectedPass.holderName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Validity:</span>
                <span className="font-bold text-slate-900">{selectedPass.validDate}</span>
              </div>
              {Object.entries(selectedPass.details).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{k}:</span>
                  <span className="font-bold text-blue-700">{v}</span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => copyToClipboard(selectedPass.referenceCode)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                {copiedCode === selectedPass.referenceCode ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Ref</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  alert(`Pass "${selectedPass.title}" added to your mobile Apple/Google Wallet!`);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Save to Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Pass Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add Booking / E-Ticket to Wallet
            </h3>

            <form onSubmit={handleCreatePass} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Pass Category</label>
                <select
                  value={newPassType}
                  onChange={(e) => setNewPassType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="flight">Airline Boarding Pass</option>
                  <option value="hotel">Hotel / Airbnb Voucher</option>
                  <option value="attraction">Tourist Attraction Ticket</option>
                  <option value="transit">Metro / Rail Transit Card</option>
                  <option value="insurance">Insurance Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Pass Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Louvre FastPass or Shinkansen Express"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Provider / Airline / Merchant</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Singapore Airlines, Klook, JR East"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Confirmation / Booking Reference</label>
                <input
                  type="text"
                  placeholder="e.g. TC-992817"
                  value={newRefCode}
                  onChange={(e) => setNewRefCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Add to Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
