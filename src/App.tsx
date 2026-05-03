/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Printer, 
  Image as ImageIcon, 
  Trash2, 
  Settings, 
  Palette, 
  QrCode,
  Save,
  Grid,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { COLORS, POSTER_SIZES, INITIAL_POSTER, PosterData, COLOR_PALETTES } from './constants';
import { CoastersLogo } from './components/CoastersLogo';

export default function App() {
  const [poster, setPoster] = useState<PosterData>(INITIAL_POSTER);
  const [gallery, setGallery] = useState<PosterData[]>([]);
  const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'visuals' | 'gallery'>('branding');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    // Set initial size
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('coasters-gallery');
    if (saved) setGallery(JSON.parse(saved));
  }, []);

  const handleElementClick = (element: string, tab: 'branding' | 'content' | 'visuals') => {
    setActiveTab(tab);
    setFocusedElement(element);
    setSidebarOpen(true);
    
    // Smooth scroll to the element's control if it exists
    setTimeout(() => {
      const el = document.getElementById(`control-${element}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.classList.add('ring-2', 'ring-gold');
      setTimeout(() => el?.classList.remove('ring-2', 'ring-gold'), 2000);
    }, 100);
  };

  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!posterRef.current) return;
    
    try {
      if (format === 'pdf') {
        const dataUrl = await toPng(posterRef.current, { quality: 1, pixelRatio: 3 });
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4'
        });
        
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`coasters-${poster.theme}-${Date.now()}.pdf`);
      } else {
        const dataUrl = format === 'png' 
          ? await toPng(posterRef.current, { quality: 1, pixelRatio: 2 })
          : await toJpeg(posterRef.current, { quality: 0.95, pixelRatio: 2 });
        
        const link = document.createElement('a');
        link.download = `coasters-${poster.theme}-${Date.now()}.${format}`;
        link.href = dataUrl;
        link.click();
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToGallery = () => {
    const newPoster = { ...poster, id: Date.now().toString() };
    const newGallery = [newPoster, ...gallery];
    setGallery(newGallery);
    localStorage.setItem('coasters-gallery', JSON.stringify(newGallery));
    confetti({
      particleCount: 50,
      radius: 100,
      origin: { y: 0.9 }
    });
    setActiveTab('gallery');
  };

  const currentSize = POSTER_SIZES.find(s => s.name === poster.size) || POSTER_SIZES[1];
  const isA4 = poster.size === 'A4';
  const gutterSize = isA4 ? 113 : 0; // 4cm at 210mm wide scaled to 595px

  // Calculate dynamic scale to fit viewport
  const availableWidth = viewportSize.width - (sidebarOpen ? 450 : 100);
  const availableHeight = viewportSize.height - 150;
  const paddingFactor = 0.85;
  
  const autoScale = Math.min(
    (availableWidth * paddingFactor) / currentSize.width,
    (availableHeight * paddingFactor) / currentSize.height
  );

  const finalScale = isPreviewMode ? autoScale * 1.1 : autoScale;

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Dark Sidebar Navigation */}
      <nav className="w-16 md:w-20 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-8 gap-10 flex-shrink-0 z-30">
        <div className="text-gold mb-4 group cursor-pointer" onClick={() => setIsPreviewMode(!isPreviewMode)}>
          <div className={`p-3 rounded-full transition-all ${isPreviewMode ? 'bg-gold text-black' : 'hover:bg-gold/10'}`}>
            <Eye className="w-6 h-6" />
          </div>
        </div>
        
        <NavButton active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} icon={<Grid />} label="Branding" />
        <NavButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Settings />} label="Content" />
        <NavButton active={activeTab === 'visuals'} onClick={() => setActiveTab('visuals')} icon={<Palette />} label="Visuals" />
        <NavButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<Save />} label="Library" />

        <div className="mt-auto flex flex-col gap-4">
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-3 text-zinc-600 hover:text-white transition-colors"
           >
             {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
           </button>
        </div>
      </nav>

      {/* Control Panel (Dark Mode) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-zinc-900 border-r border-zinc-800 overflow-y-auto z-20 shadow-2xl"
          >
            <div className="p-8">
              <header className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {activeTab}
                </h2>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <AnimatePresence mode="wait">
                {activeTab === 'branding' && (
                  <motion.div key="brand" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quick Templates</label>
                      <div className="grid grid-cols-2 gap-3 pb-4">
                        {[
                          { name: 'Sunday Roast', title: 'Sunday Specials', sub: 'Classic Carvery', color: '#1A1512', accent: '#CBA844', icon: '🍽️' },
                          { name: 'Chase Ace', title: 'Chase the Ace', sub: 'Every Tuesday', color: '#0D2B45', accent: '#FFD700', icon: '🃏' },
                          { name: 'Halloween', title: 'Halloween Party', sub: 'Friday 31st Oct', color: '#0F0F0F', accent: '#FF7518', icon: '🎃' },
                          { name: 'Trivia Night', title: 'Wednesday Trivia', sub: 'Quiz from 7pm', color: '#0D2B45', accent: '#DEEFFF', icon: '📝' },
                          { name: 'Xmas Party', title: 'Christmas Eve', sub: 'Santa arrives 5pm', color: '#0B3D1D', accent: '#C41E3A', icon: '🎄' },
                          { name: 'Race Day', title: 'Melbourne Cup', sub: 'Lawn Party', color: '#2E5A27', accent: '#CBA844', icon: '🏇' }
                        ].map((tmpl) => (
                          <button 
                            key={tmpl.name}
                            onClick={() => setPoster({
                              ...poster,
                              title: tmpl.title,
                              subtitle: tmpl.sub,
                              backgroundColor: tmpl.color,
                              accentColor: tmpl.accent,
                              textColor: '#FFFFFF'
                            })}
                            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl hover:border-gold/50 transition-all text-left group"
                          >
                            <span className="text-xl mb-2 block">{tmpl.icon}</span>
                            <span className="text-[9px] font-bold uppercase tracking-tight block text-zinc-400 group-hover:text-gold transition-colors">{tmpl.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Brand Mode</label>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => setPoster({...poster, theme: 'tavern'})}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${poster.theme === 'tavern' ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${poster.theme === 'tavern' ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <div className="text-left">
                            <span className="block font-bold">Coasters Tavern</span>
                            <span className="text-[10px] opacity-60">Classic Logo & Traditional Branding</span>
                          </div>
                        </button>
                        <button 
                          onClick={() => setPoster({...poster, theme: 'social_club'})}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${poster.theme === 'social_club' ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${poster.theme === 'social_club' ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <div className="text-left">
                            <span className="block font-bold">Social Club</span>
                            <span className="text-[10px] opacity-60">Iconic Badge & Community Heritage</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Page Scale</label>
                      <div className="grid grid-cols-1 gap-2">
                        {POSTER_SIZES.map(s => (
                          <button 
                            key={s.name}
                            onClick={() => setPoster({...poster, size: s.name})}
                            className={`p-3 text-left text-xs rounded-lg border transition-all ${poster.size === s.name ? 'bg-zinc-800 border-zinc-600' : 'bg-transparent border-zinc-800 opacity-60 hover:opacity-100'}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      {poster.size === 'A4' && <p className="text-[9px] text-gold/60 uppercase font-bold mt-1 tracking-wider">Note: 4cm gutter active for standard A4</p>}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'content' && (
                  <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-4">
                       <div className="group" id="control-title">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Headline</label>
                         <input 
                           type="text" 
                           value={poster.title} 
                           onChange={e => setPoster({...poster, title: e.target.value})}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm transition-colors ${focusedElement === 'title' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>
                       <div id="control-subtitle">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Secondary Label</label>
                         <input 
                           type="text" 
                           value={poster.subtitle} 
                           onChange={e => setPoster({...poster, subtitle: e.target.value})}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm ${focusedElement === 'subtitle' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>
                       <div id="control-details">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Event Details</label>
                         <textarea 
                           value={poster.details} 
                           onChange={e => setPoster({...poster, details: e.target.value})}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg h-32 focus:border-gold outline-none text-sm resize-none ${focusedElement === 'details' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div id="control-date">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Event Date</label>
                           <input 
                             type="text" 
                             value={poster.eventDate} 
                             onChange={e => setPoster({...poster, eventDate: e.target.value})}
                             placeholder="e.g. Every Friday"
                             className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm ${focusedElement === 'date' ? 'border-gold bg-gold/5' : ''}`}
                           />
                         </div>
                         <div id="control-time">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Event Time</label>
                           <input 
                             type="text" 
                             value={poster.eventTime} 
                             onChange={e => setPoster({...poster, eventTime: e.target.value})}
                             placeholder="e.g. 7:00 PM"
                             className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm ${focusedElement === 'time' ? 'border-gold bg-gold/5' : ''}`}
                           />
                         </div>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-3">QR Integration</label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                          <QrCode className="w-5 h-5 text-zinc-600" />
                          <input 
                            type="text" 
                            value={poster.qrUrl} 
                            onChange={e => setPoster({...poster, qrUrl: e.target.value})}
                            placeholder="https://..."
                            className="bg-transparent text-xs w-full outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">QR Location</label>
                           <div className="grid grid-cols-2 gap-2">
                              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => (
                                <button 
                                  key={pos}
                                  onClick={() => setPoster({...poster, qrPosition: pos})}
                                  className={`p-2 text-[10px] uppercase font-bold rounded border transition-all ${poster.qrPosition === pos ? 'bg-gold text-black border-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                >
                                  {pos.replace('-', ' ')}
                                </button>
                              ))}
                           </div>
                        </div>
                        <div className="flex gap-2">
                           {['#000000', '#CBA844', '#7B2B3B', '#344A3C'].map(c => (
                             <button 
                               key={c}
                               onClick={() => setPoster({...poster, qrColor: c})}
                               className={`w-8 h-8 rounded-full border-2 ${poster.qrColor === c ? 'border-gold' : 'border-transparent'}`}
                               style={{ backgroundColor: c }}
                             />
                           ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'visuals' && (
                  <motion.div key="visuals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Brand Palettes</label>
                       <div className="flex flex-col gap-2">
                         {COLOR_PALETTES.map(p => (
                           <button 
                             key={p.name}
                             onClick={() => setPoster({...poster, backgroundColor: p.bg, textColor: p.text, accentColor: p.accent})}
                             className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all group"
                           >
                             <span className="text-[11px] font-medium text-zinc-400 group-hover:text-white">{p.name}</span>
                             <div className="flex gap-1">
                               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.bg }} />
                               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.text }} />
                               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
                             </div>
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="space-y-4 pt-6 border-t border-zinc-800">
                       <div className="flex justify-between items-center">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Content Density</label>
                         <span className="text-[10px] font-mono text-gold">{(poster.contentScale * 100).toFixed(0)}%</span>
                       </div>
                       <input 
                         type="range" min="0.5" max="1.5" step="0.05"
                         value={poster.contentScale}
                         onChange={e => setPoster({...poster, contentScale: parseFloat(e.target.value)})}
                         className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-gold"
                       />
                     </div>

                     <div className="space-y-4">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Asset Management</label>
                       <div className="flex flex-col gap-4">
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="w-full h-16 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center gap-3 hover:border-gold hover:bg-gold/5 transition-all text-zinc-500 hover:text-gold"
                         >
                           <ImageIcon className="w-5 h-5" />
                           <span className="text-xs font-bold uppercase">Insert Imagery</span>
                         </button>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setPoster({...poster, image: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                         }} />
                         
                         {poster.image && (
                           <div className="space-y-4">
                             <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                               <img src={poster.image} className="w-full h-32 object-cover grayscale opacity-50" alt="" />
                               <button 
                                 onClick={() => setPoster({...poster, image: undefined})}
                                 className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:scale-110 transition-transform"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                             
                             <div className="space-y-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                               <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Scale</label>
                                    <span className="text-[8px] text-zinc-600">{(poster.imageScale * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="3" step="0.05"
                                    value={poster.imageScale}
                                    onChange={e => setPoster({...poster, imageScale: parseFloat(e.target.value)})}
                                    className="w-full h-1 accent-gold"
                                  />
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Horizontal</label>
                                    <input 
                                      type="range" min="-100" max="100" step="1"
                                      value={poster.imageOffset.x}
                                      onChange={e => setPoster({...poster, imageOffset: { ...poster.imageOffset, x: parseInt(e.target.value) }})}
                                      className="w-full h-1 accent-gold"
                                    />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Vertical</label>
                                    <input 
                                      type="range" min="-100" max="100" step="1"
                                      value={poster.imageOffset.y}
                                      onChange={e => setPoster({...poster, imageOffset: { ...poster.imageOffset, y: parseInt(e.target.value) }})}
                                      className="w-full h-1 accent-gold"
                                    />
                                 </div>
                               </div>

                               <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Overlay Fade</label>
                                    <span className="text-[8px] text-zinc-600">{(poster.overlayOpacity * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.95" step="0.05"
                                    value={poster.overlayOpacity}
                                    onChange={e => setPoster({...poster, overlayOpacity: parseFloat(e.target.value)})}
                                    className="w-full h-1 accent-gold"
                                  />
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {gallery.length === 0 ? (
                      <div className="text-center py-20 opacity-20">
                        <Save className="w-10 h-10 mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase">No archived designs</p>
                      </div>
                    ) : (
                      gallery.map(item => (
                        <div key={item.id} className="group relative bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:border-gold transition-all">
                          <button onClick={() => setPoster(item)} className="w-full text-left">
                            <span className="block text-xs font-bold mb-1 truncate pr-6">{item.title}</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{item.theme.replace('_', ' ')} • {item.size}</span>
                          </button>
                          <button 
                            onClick={() => {
                               const next = gallery.filter(g => g.id !== item.id);
                               setGallery(next);
                               localStorage.setItem('coasters-gallery', JSON.stringify(next));
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Preview Area (High Professionalism) */}
      <main className={`flex-1 relative transition-all duration-700 bg-zinc-900 ${isPreviewMode ? 'p-0' : 'p-6 md:p-12'} overflow-auto flex flex-col items-center`}>
        {/* Toolbelt */}
        {!isPreviewMode && (
          <div className="w-full max-w-4xl flex justify-between items-center mb-10 bg-zinc-950/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Working On</span>
                <span className="text-sm font-bold text-gold">{poster.theme === 'tavern' ? 'Coasters Tavern' : 'Social Club'}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <button onClick={() => setPoster(INITIAL_POSTER)} className="text-xs font-bold uppercase text-zinc-400 hover:text-white transition-colors">Reset</button>
            </div>

            <div className="flex items-center gap-3">
              <HeaderAction icon={<Printer />} label="Print" onClick={handlePrint} />
              <HeaderAction icon={<Download />} label="JPG" onClick={() => handleExport('jpg')} />
              <HeaderAction icon={<Download />} label="PDF" onClick={() => handleExport('pdf')} />
              <div className="h-8 w-px bg-white/10 mx-2" />
              <HeaderAction icon={<Send />} label="Push to Cloud" onClick={() => {
                alert("Poster pushed to venue servers.");
                confetti();
              }} highlighted />
              <HeaderAction icon={<Save />} label="Lock & Archive" onClick={handleSaveToGallery} highlighted />
            </div>
          </div>
        )}

        {/* Scaled Poster Container */}
        <div 
          className="relative transition-all duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          style={{ transform: `scale(${finalScale})`, transformOrigin: 'top center' }}
        >
            <div 
              ref={posterRef}
              id="poster-output"
              className="relative overflow-hidden flex flex-col"
              style={{ 
                width: currentSize.width, 
                height: currentSize.height,
                backgroundColor: poster.backgroundColor,
                color: poster.textColor
              }}
            >
              {/* Background Layout: Top 1/3 Photo + Bottom 2/3 Solid */}
              <div className="absolute inset-0 pointer-events-none flex flex-col">
                <div className="h-1/3 relative overflow-hidden group/bg">
                  {poster.image && (
                    <img 
                      src={poster.image} 
                      className="w-full h-full object-cover blur-2xl opacity-60 transition-transform duration-700 brightness-75 scale-110" 
                      style={{ 
                        transform: `scale(${poster.imageScale * 1.25}) translate(${poster.imageOffset.x}px, ${poster.imageOffset.y}px)`,
                      }}
                      alt="" 
                    />
                  )}
                  {/* Decorative Overlay for Image Bleed */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent" 
                    style={{ 
                      backgroundColor: poster.backgroundColor, 
                      opacity: poster.image ? 0.4 : 0,
                      backgroundImage: `linear-gradient(to bottom, transparent 0%, ${poster.backgroundColor} 100%)`
                    }} 
                  />
                </div>
                <div 
                  className="flex-1" 
                  style={{ backgroundColor: poster.backgroundColor }} 
                />
              </div>

              {/* Content Wrapper for A4 Guard/Margin */}
              <div 
                className="relative z-10 flex-1 flex flex-col items-center justify-between pointer-events-none transition-transform duration-300"
                style={{ 
                  margin: `${gutterSize}px`,
                  transform: `scale(${poster.contentScale})`,
                  transformOrigin: 'center'
                }}
              >
                {/* Branding Header */}
                <div 
                  className="pt-8 flex flex-col items-center cursor-pointer pointer-events-auto hover:ring-2 hover:ring-gold/30 rounded-full p-4 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick('logo', 'branding');
                  }}
                >
                  <div className="w-40 h-40 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]">
                    <CoastersLogo 
                       theme={poster.theme} 
                       className="w-full h-full" 
                       color={poster.backgroundColor}
                       accentColor={poster.accentColor}
                    />
                  </div>
                </div>

                {/* Footer & QR Container */}
                <div className="w-full flex-1 flex flex-col items-center justify-between pointer-events-none relative">
                  {/* Independent QR Code Positioning */}
                  {poster.qrUrl && (
                    <div 
                      className="absolute bg-white p-5 rounded-2xl shadow-2xl border-2 pointer-events-auto cursor-pointer hover:ring-2 hover:ring-gold transition-all"
                      style={{ 
                        borderColor: poster.accentColor,
                        top: poster.qrPosition.startsWith('top') ? '0' : 'auto',
                        bottom: poster.qrPosition.startsWith('bottom') ? '0' : 'auto',
                        left: poster.qrPosition.endsWith('left') ? '0' : 'auto',
                        right: poster.qrPosition.endsWith('right') ? '0' : 'auto',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('qr', 'content');
                      }}
                    >
                      <QRCodeSVG 
                        value={poster.qrUrl} 
                        size={110} 
                        fgColor={poster.qrColor}
                        level="H"
                      />
                      <p className="text-[9px] text-center mt-3 font-bold text-black uppercase tracking-widest">Inquire Within</p>
                    </div>
                  )}

                  <div 
                    className="flex-1 flex flex-col items-center justify-center text-center pointer-events-auto cursor-pointer group"
                    onClick={() => handleElementClick('title', 'content')}
                  >
                    <h1 
                      className={`text-8xl md:text-9xl font-serif font-bold uppercase leading-[0.85] tracking-tighter mb-8 transition-all ${focusedElement === 'title' ? 'scale-105 blur-[0.5px]' : 'group-hover:scale-[1.02]'}`}
                      style={{ color: poster.textColor }}
                    >
                      {poster.title || "COASTERS"}
                    </h1>
                    
                    <div className="h-1.5 w-32 mb-10" style={{ backgroundColor: poster.accentColor }} />
                    
                    <h2 
                      className="text-3xl md:text-4xl font-bold uppercase tracking-[0.4em] mb-12 hover:text-gold transition-colors"
                      style={{ color: poster.accentColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('subtitle', 'content');
                      }}
                    >
                      {poster.subtitle || "EST. 1876"}
                    </h2>

                    {(poster.eventDate || poster.eventTime) && (
                      <div 
                        className="mb-10 flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementClick('date', 'content');
                        }}
                      >
                        {poster.eventDate && (
                          <div 
                            className="text-2xl font-black uppercase tracking-[0.2em] px-4 py-2 border-y-2"
                            style={{ borderColor: poster.accentColor, color: poster.textColor }}
                          >
                            {poster.eventDate}
                          </div>
                        )}
                        {poster.eventTime && (
                          <div 
                            className="text-lg font-bold uppercase tracking-[0.3em]"
                            style={{ color: poster.accentColor }}
                          >
                            {poster.eventTime}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl whitespace-pre-line opacity-90 hover:opacity-100 transition-opacity"
                      style={{ color: poster.textColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('details', 'content');
                      }}
                    >
                      {poster.details}
                    </div>
                  </div>

                  <div 
                    className="w-full flex items-end justify-between pb-8 cursor-help pointer-events-auto"
                    onClick={() => handleElementClick('branding', 'branding')}
                  >
                    <div className="text-left space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Coastal Heritage</p>
                      <p className="text-lg font-serif italic" style={{ color: poster.accentColor }}>Since 1876</p>
                    </div>
                    {/* Space for QR if it were static - removed as it's now absolute */}
                    <div className="w-[154px]" /> 
                  </div>
                </div>
              </div>

              {/* Debug Margin Lines (Only visible when A4 and editing) */}
              {isA4 && !isPreviewMode && (
                <div className="absolute inset-0 pointer-events-none border-[113px] border-white/5 opacity-50 flex items-center justify-center">
                  <div className="absolute top-0 left-0 text-[10px] bg-gold text-black px-2 mt-[114px] ml-[114px]">4cm Gutter Boundary</div>
                </div>
              )}
              
              {/* Style Guide Trim */}
              <div className="absolute top-0 left-0 w-full h-3 bg-white/10" />
              <div className="absolute bottom-0 left-0 w-full h-3 bg-black/20" />
            </div>
          </div>

        {/* Overlay toggle for mobile/fullscreen */}
        {isPreviewMode && (
          <button 
            onClick={() => setIsPreviewMode(false)}
            className="fixed bottom-10 right-10 p-4 bg-gold text-black rounded-full shadow-2xl z-50 animate-bounce"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </main>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; left: 0; top: 0; width: 100%; height: 100%; }
        }
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #CBA844;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: #333;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-gold/10 text-gold scale-110 border border-gold/20' : 'text-zinc-600 hover:text-zinc-300'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      <span className={`absolute left-full ml-4 px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-2xl`}>
        {label}
      </span>
    </button>
  );
}

function HeaderAction({ icon, label, onClick, highlighted = false }: { icon: React.ReactNode, label: string, onClick: () => void, highlighted?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
        highlighted 
          ? 'bg-gold text-black hover:bg-gold/90 shadow-[0_8px_20px_rgba(203,168,68,0.2)]' 
          : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
      <span>{label}</span>
    </button>
  );
}
