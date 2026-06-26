import React, { useState, useEffect } from 'react';
import { ProofOfPayment } from '../types';
import { IdentityVerification } from './IdentityVerification';
import { 
  Check, 
  X, 
  Eye, 
  DollarSign, 
  Users, 
  Activity, 
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  LayoutGrid,
  History,
  MoreVertical
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export const AdminDashboard = ({ 
  setBalance, 
  setMessages,
  payments,
  setPayments,
  setNotifications,
  onResetAllData
}: { 
  setBalance: React.Dispatch<React.SetStateAction<number>>; 
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  payments: ProofOfPayment[];
  setPayments: React.Dispatch<React.SetStateAction<ProofOfPayment[]>>;
  setNotifications?: React.Dispatch<React.SetStateAction<any[]>>;
  onResetAllData?: () => void;
}) => {
  const [fullScreenDoc, setFullScreenDoc] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'deposits' | 'identity'>('deposits');
  
  // Clean, realistic live counter states
  const [onlineUsers, setOnlineUsers] = useState(() => {
    const saved = localStorage.getItem("admin_online_users");
    return saved !== null ? Number(saved) : 0;
  });
  const [onlineVisitors, setOnlineVisitors] = useState(() => {
    const saved = localStorage.getItem("admin_online_visitors");
    return saved !== null ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("admin_online_users", onlineUsers.toString());
  }, [onlineUsers]);

  useEffect(() => {
    localStorage.setItem("admin_online_visitors", onlineVisitors.toString());
  }, [onlineVisitors]);

  // Simple live fluctuations
  useEffect(() => {
    const userInterval = setInterval(() => {
      setOnlineUsers(prev => {
        if (prev === 0) return 0;
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(120, Math.min(180, prev + change));
      });
    }, 4000);

    const visitorInterval = setInterval(() => {
      setOnlineVisitors(prev => {
        if (prev === 0) return 0;
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(800, Math.min(920, prev + change));
      });
    }, 3000);

    return () => {
      clearInterval(userInterval);
      clearInterval(visitorInterval);
    };
  }, []);

  // Calculate live profit (12% commission from all approved payments)
  const totalApprovedAmount = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const platformCommissionRate = 0.12; // 12%
  const liveProfit = totalApprovedAmount * platformCommissionRate;

  const approvePayment = async (p: ProofOfPayment) => {
    if (isSupabaseConfigured) {
      try {
        // 1. Update payment status
        const { error: payError } = await supabase
          .from('proofs_of_payment')
          .update({ status: 'approved' })
          .eq('id', p.id);
        
        if (payError) throw payError;

        // 2. Fetch target user's current balance
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', p.userId)
          .single();
        
        if (profError) throw profError;

        // 3. Update target user's balance
        const { error: balError } = await supabase
          .from('profiles')
          .update({ balance: (Number(profile.balance) || 0) + p.amount })
          .eq('id', p.userId);
        
        if (balError) throw balError;

        // 4. Send success message to user
        await supabase.from('messages').insert([{
          user_id: p.userId,
          text: `Your purchase of ${p.amount} Coins has been verified and approved! ${p.amount} Coins have been added to your balance.`,
          sender: 'contact',
          contact_id: 'admin'
        }]);

      } catch (err) {
        console.error("Admin approval error:", err);
        alert("Failed to approve payment in database.");
      }
    }

    setPayments(prev => prev.map(pay => pay.id === p.id ? { ...pay, status: 'approved' } : pay));
    
    if (setNotifications) {
      setNotifications(prev => [
        { 
          id: Date.now().toString(), 
          title: 'Payment Approved', 
          message: `Your payment of ${p.amount} Coins has been approved!`, 
          time: 'Just now', 
          type: 'success' 
        },
        ...prev
      ]);
    }

    const event = new CustomEvent('add-notification', { 
        detail: { id: Date.now().toString(), title: 'Payment Approved', message: `Your payment of ${p.amount} Coins has been approved!`, time: 'Just now', type: 'success' } 
    });
    window.dispatchEvent(event);
  };
  
  const rejectPayment = async (p: ProofOfPayment) => {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('proofs_of_payment')
          .update({ status: 'rejected' })
          .eq('id', p.id);
      } catch (err) {
        console.error("Admin rejection error:", err);
      }
    }
    setPayments(prev => prev.map(pay => pay.id === p.id ? { ...pay, status: 'rejected' } : pay));
  };

  return (
    <div className="p-3 bg-slate-50 min-h-screen pb-24">
      {/* Header bar */}
      <div className="flex justify-between items-center mb-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Simple Dashboard & Verifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onResetAllData && (
            <button
              onClick={() => {
                if (!confirmReset) {
                  setConfirmReset(true);
                } else {
                  onResetAllData();
                  setOnlineUsers(0);
                  setOnlineVisitors(0);
                  setConfirmReset(false);
                }
              }}
              onMouseLeave={() => setConfirmReset(false)}
              className={`flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition ${
                confirmReset 
                  ? "bg-rose-600 text-white animate-pulse" 
                  : "bg-rose-50 hover:bg-rose-100 text-rose-600"
              }`}
            >
              <RotateCcw size={10} />
              {confirmReset ? "Click to Confirm" : "Reset Data"}
            </button>
          )}
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      {/* 3 Core Requested Metrics Grid - Compact layout */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        
        {/* Metric 1: Live Profit */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <DollarSign size={16} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider leading-none">Profit</p>
            <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
              R {(liveProfit * 0.1).toFixed(2)}
            </p>
            <p className="text-[7px] text-slate-400 font-bold mt-0.5 leading-none">12% Comm.</p>
          </div>
        </div>

        {/* Metric 2: Live Online Users */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 relative">
            <Users size={16} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider leading-none">Online</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">{onlineUsers}</p>
            <p className="text-[7px] text-emerald-500 font-bold mt-0.5 leading-none">● Active</p>
          </div>
        </div>

        {/* Metric 3: Live Online Visitors */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider leading-none">Visitors</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">{onlineVisitors}</p>
            <p className="text-[7px] text-amber-500 font-bold mt-0.5 leading-none">⚡ Browsing</p>
          </div>
        </div>

      </div>

      {/* Sub-tab Switcher */}
      <div className="flex gap-2 mb-3 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
        <button
          onClick={() => setActiveSubTab('deposits')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeSubTab === 'deposits' 
              ? 'bg-slate-900 text-white shadow-sm font-black' 
              : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          🏦 Deposit Queue ({payments.filter(p => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveSubTab('identity')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeSubTab === 'identity' 
              ? 'bg-slate-900 text-white shadow-sm font-black' 
              : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          👤 ID Verification System
        </button>
      </div>

      {activeSubTab === 'deposits' ? (
        /* Simple Deposit Queue List */
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-50">
            <h2 className="text-[9px] font-black uppercase text-slate-800 tracking-widest">Deposits Queue</h2>
            <span className="text-[8px] bg-indigo-50 text-indigo-600 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              {payments.filter(p => p.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-1.5">
            {payments.filter(p => p.status === 'pending').map(p => (
              <div 
                key={p.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded bg-indigo-50 flex items-center justify-center font-black text-[10px] text-indigo-600 px-1">
                    {p.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[11px] leading-tight">{p.userName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-indigo-600">{p.amount} Coins</span>
                      <span className="text-[8px] text-slate-400 font-medium">{p.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setFullScreenDoc(p.documentUrl)} 
                    className="px-1.5 py-1 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-100 transition flex items-center gap-0.5 text-[9px] font-bold"
                    title="View Receipt File"
                  >
                    <Eye size={11} /> Receipt
                  </button>
                  <button 
                    onClick={() => approvePayment(p)} 
                    className="px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm"
                  >
                    <Check size={11} /> Approve
                  </button>
                  <button 
                    onClick={() => rejectPayment(p)} 
                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded transition"
                    title="Reject"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            ))}

            {payments.filter(p => p.status === 'pending').length === 0 && (
              <p className="text-slate-400 text-center text-[10px] py-4 font-medium">All deposit purchase receipts are verified!</p>
            )}
          </div>
        </div>
      ) : (
        <IdentityVerification />
      )}

      {/* Receipts Viewer Modal - Enhanced for Full Screen Inspection */}
      {fullScreenDoc && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10" onClick={() => setFullScreenDoc(null)}>
          <div 
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Eye size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Proof of Payment Document</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">High-Resolution Inspection View</p>
                </div>
              </div>
              <button 
                onClick={() => setFullScreenDoc(null)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Stage */}
            <div className="flex-1 bg-slate-50 overflow-auto flex items-start justify-center p-2 sm:p-4">
              <img 
                src={fullScreenDoc} 
                alt="Receipt Proof" 
                className="max-w-full h-auto object-contain rounded-lg shadow-lg border border-slate-200" 
              />
            </div>

            {/* Footer / Info bar */}
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Activity size={12} /> Live Verification</span>
                <span className="hidden sm:inline">●</span>
                <span className="hidden sm:inline">Encrypted Connection</span>
              </div>
              <button 
                onClick={() => setFullScreenDoc(null)}
                className="py-2 px-6 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-md active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
