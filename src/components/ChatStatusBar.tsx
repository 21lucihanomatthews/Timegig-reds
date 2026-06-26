import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Contact } from "../types";

interface ChatStatusBarProps {
  contacts: Contact[];
  activeProvince: string;
  isChatActive?: boolean;
}

export const ChatStatusBar: React.FC<ChatStatusBarProps> = ({ 
  contacts, 
  activeProvince,
  isChatActive
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userGigs, setUserGigs] = React.useState<{ url: string, type: string, timestamp: number }[]>([]);
  const [viewingStatus, setViewingStatus] = useState<{ url: string, name: string, type: string } | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(5);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newGigs = Array.from(files).map((file: any) => ({
        url: URL.createObjectURL(file as Blob),
        type: file.type,
        timestamp: Date.now()
      }));
      setUserGigs(prev => [...newGigs, ...prev]);
    }
  };

  // Filter user gigs to only those from the last 24 hours
  const filteredUserGigs = userGigs.filter(gig => Date.now() - gig.timestamp < 24 * 60 * 60 * 1000);

  // Filter contacts to only those with statuses from the last 24 hours
  const filteredContacts = contacts.filter(contact => {
    if (!contact.createdAt) return true; // Default to showing if no timestamp
    const statusTime = new Date(contact.createdAt).getTime();
    return Date.now() - statusTime < 24 * 60 * 60 * 1000;
  });

  const handleStatusClick = (url: string, name: string, type: string = "image/jpeg") => {
    setVideoDuration(5); // Default for images
    setViewingStatus({ url, name, type });
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setVideoDuration(e.currentTarget.duration || 5);
  };

  return (
    <div className="flex flex-col w-full shadow-lg">
      <AnimatePresence>
        {viewingStatus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
          >
            {/* Header with user info */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden bg-white/10">
                  {viewingStatus.type.startsWith('video/') ? (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white font-bold">
                      {viewingStatus.name.charAt(0)}
                    </div>
                  ) : (
                    <img src={viewingStatus.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm tracking-tight">{viewingStatus.name}</span>
                  <span className="text-white/50 text-[10px] uppercase tracking-widest font-black">Just now</span>
                </div>
              </div>
              <button 
                onClick={() => setViewingStatus(null)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bars */}
            <div className="absolute top-4 left-6 right-6 flex gap-1 z-10">
              <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  key={viewingStatus.url}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: videoDuration, ease: "linear" }}
                  onAnimationComplete={() => {
                    if (!viewingStatus.type.startsWith('video/')) {
                      setViewingStatus(null);
                    }
                  }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg aspect-[9/16] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {viewingStatus.type.startsWith('video/') ? (
                <video 
                  src={viewingStatus.url} 
                  autoPlay 
                  muted
                  playsInline 
                  onLoadedMetadata={handleVideoMetadata}
                  className="w-full h-full object-cover"
                  onEnded={() => setViewingStatus(null)}
                />
              ) : (
                <img 
                  src={viewingStatus.url} 
                  alt="Status Content" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,video/*" 
        multiple 
        className="hidden" 
      />
      {/* App Branded Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-black text-white px-4 py-4 flex items-center justify-between relative overflow-hidden z-20">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="flex items-center gap-2 relative z-10">
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
        </div>
      </div>

      {/* Modern Status Stories Bar */}
      {!isChatActive && (
        <div className="bg-white border-b border-slate-100 py-4 shadow-inner overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-5 px-4 min-w-max">
            {/* User's Own Status */}
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {
                if (filteredUserGigs.length > 0) {
                  handleStatusClick(filteredUserGigs[0].url, "My Gig", filteredUserGigs[0].type);
                } else {
                  handleUploadClick({ stopPropagation: () => {} } as any);
                }
              }}
            >
              <div className="relative">
                <div className={`w-[62px] h-[62px] rounded-2xl overflow-hidden flex items-center justify-center transition-all ${filteredUserGigs.length > 0 ? 'border-2 border-red-500 p-0.5' : 'bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-red-400'}`}>
                  {filteredUserGigs.length > 0 ? (
                    filteredUserGigs[0].type.startsWith('video/') ? (
                      <video 
                        src={filteredUserGigs[0].url} 
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <img 
                        src={filteredUserGigs[0].url} 
                        alt="My Gig" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )
                  ) : (
                    <Plus size={24} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                  )}
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-red-600 rounded-lg border-2 border-white flex items-center justify-center shadow-md shadow-red-200 z-10"
                >
                  <Plus size={14} className="text-white" />
                </motion.div>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Gigs</span>
            </div>

            {/* Contact Statuses */}
            {filteredContacts.map((contact, index) => (
              <motion.div 
                key={contact.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusClick(contact.picture || contact.avatar || "", contact.name)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="relative p-[3px] rounded-2xl bg-gradient-to-tr from-red-600 to-indigo-600 shadow-sm transition-transform group-hover:rotate-6">
                  <div className="w-[56px] h-[56px] rounded-xl overflow-hidden border-2 border-white bg-slate-100">
                    <img 
                      src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`} 
                      alt={contact.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Story count indicators - simulated with segments */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/30 border-dashed pointer-events-none" />
                </div>
                <span className="text-[10px] font-bold text-slate-800 max-w-[68px] truncate text-center tracking-tight">
                  {contact.name.split(' ')[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Info Strip */}
      <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250px_250px] animate-[pulse_3s_linear_infinite]" />
        
        <div className="flex items-center gap-3 relative z-10">
        </div>

        <div className="flex items-center gap-4 relative z-10">
        </div>
      </div>
    </div>
  );
};
