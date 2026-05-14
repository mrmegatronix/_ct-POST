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
  Eye,
  LayoutTemplate,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveVertical,
  Cloud,
  Mail,
  MonitorDown,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { COLORS, POSTER_SIZES, INITIAL_POSTER, PosterData, COLOR_PALETTES, LAYOUT_SAMPLES } from './constants';
import { CoastersLogo } from './components/CoastersLogo';


export function PosterDisplay({ poster, currentSize, innerRef, gutterSize, baseContentScale, handleElementClick, focusedElement, isPreviewMode }: any) {
  return (
<div 
              ref={innerRef}
              id="poster-output"
              className="relative overflow-hidden flex flex-col"
              style={{ 
                width: currentSize.width, 
                height: currentSize.height,
                backgroundColor: poster.backgroundColor,
                color: poster.textColor
              }}
            >
              {/* Background Split */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* Top Image Section */}
                <div 
                  className="absolute top-0 left-0 right-0 overflow-hidden"
                  style={{ height: `${100 - (poster.solidBackgroundHeight ?? 50)}%` }}
                >
                  {poster.image ? (
                    <img 
                      src={poster.image} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none" 
                      style={{ 
                        opacity: 1 - (poster.overlayOpacity ?? 0.2),
                        transform: `scale(${poster.imageScale * 1.25}) translate(${poster.imageOffset.x}px, ${poster.imageOffset.y}px)`,
                      }}
                      alt="" 
                    />
                  ) : (
                    <div className="w-full h-full bg-black/5 flex flex-col items-center justify-center border-b border-dashed border-black/10">
                      <ImageIcon className="w-12 h-12 text-black/20 mb-4" />
                      <span className="text-xs uppercase tracking-widest font-bold text-black/30">Background Placeholder</span>
                    </div>
                  )}
                </div>

                {/* Foreground Image */}
                {poster.foregroundImage && (
                  <img 
                    src={poster.foregroundImage} 
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 pointer-events-none z-10" 
                    style={{ 
                      transform: `scale(${poster.foregroundScale}) translate(${poster.foregroundOffset.x}px, ${poster.foregroundOffset.y}px)`,
                    }}
                    alt="" 
                  />
                )}
              </div>

              {/* Content Wrapper for Guard/Margin */}
              <div 
                id="poster-content-wrapper"
                className="relative z-20 flex-1 flex flex-col pointer-events-none transition-transform duration-300"
                style={{ 
                  marginTop: `${gutterSize + (poster.marginTop || 0) * 28.346}px`,
                  marginBottom: `${gutterSize + (poster.marginBottom || 0) * 28.346}px`,
                  marginLeft: `${gutterSize + (poster.marginLeft || 0) * 28.346}px`,
                  marginRight: `${gutterSize + (poster.marginRight || 0) * 28.346}px`,
                  transform: `scale(${poster.contentScale * baseContentScale})`,
                  transformOrigin: 'center',
                  alignItems: 'stretch' // Ensure it stretches to edges internally
                }}
              >
                {/* Main Content Area */}
                <div id="poster-content-area" className="w-full flex-1 flex flex-col pointer-events-none relative mt-16">
                  {/* Independent QR Code Positioning */}
                  {poster.qrUrl && (
                    <div 
                      className={`absolute bg-white p-5 shadow-2xl border-2 pointer-events-auto cursor-pointer hover:ring-2 hover:ring-gold transition-all flex flex-col items-center justify-center ${poster.qrShape === 'square' ? 'rounded-none' : poster.qrShape === 'circle' ? 'rounded-[3rem]' : 'rounded-2xl'}`}
                      style={{ 
                        borderColor: poster.accentColor,
                        top: poster.qrPosition === 'center' ? 'auto' : (poster.qrPosition.startsWith('top') ? '0' : 'auto'),
                        bottom: poster.qrPosition === 'center' ? '0' : (poster.qrPosition.startsWith('bottom') ? '0' : 'auto'),
                        left: poster.qrPosition === 'center' ? '50%' : (poster.qrPosition.endsWith('left') ? '0' : 'auto'),
                        right: poster.qrPosition === 'center' ? 'auto' : (poster.qrPosition.endsWith('right') ? '0' : 'auto'),
                        transform: poster.qrPosition === 'center' ? 'translateX(-50%)' : 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('qr', 'content');
                      }}
                    >
                      <p className="text-[9px] text-center mb-3 font-bold text-black uppercase tracking-widest leading-tight">Inquire<br/>Within</p>
                      <QRCodeSVG 
                        value={poster.qrUrl} 
                        size={110} 
                        fgColor={poster.qrColor}
                        level="H"
                        imageSettings={poster.qrLogo ? {
                          src: poster.theme === 'social_club' ? '/logo-social.png' : '/logo-tavern.png',
                          x: undefined,
                          y: undefined,
                          height: 28,
                          width: 28,
                          excavate: true,
                        } : undefined}
                      />
                    </div>
                  )}

                  <div 
                    className="flex-1 flex flex-col justify-center pointer-events-auto cursor-pointer group w-full"
                    style={{ transform: `translateY(${poster.contentVerticalPosition !== undefined ? poster.contentVerticalPosition - 50 : 0}%)` }}
                    onClick={() => handleElementClick('title', 'content')}
                  >
                    <h1 
                      className={`text-8xl md:text-9xl font-serif font-bold uppercase leading-[0.85] tracking-tighter mb-8 transition-all ${focusedElement === 'title' ? 'scale-105 blur-[0.5px]' : 'group-hover:scale-[1.02]'}`}
                      style={{ color: poster.titleColor || poster.textColor, textAlign: poster.titleAlign || 'center' }}
                    >
                      {poster.title || "COASTERS"}
                    </h1>
                    
                    <div className={`h-1.5 w-32 mb-10 ${poster.titleAlign === 'left' ? 'mr-auto' : poster.titleAlign === 'right' ? 'ml-auto' : 'mx-auto'}`} style={{ backgroundColor: poster.subtitleColor || poster.accentColor }} />
                    
                    <h2 
                      className="text-3xl md:text-4xl font-bold uppercase tracking-[0.4em] mb-12 hover:text-gold transition-colors"
                      style={{ color: poster.subtitleColor || poster.accentColor, textAlign: poster.subtitleAlign || 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('subtitle', 'content');
                      }}
                    >
                      {poster.subtitle || "EST. 1876"}
                    </h2>

                    {(poster.eventDate || poster.eventTime) && (
                      <div 
                        className="mb-10 flex flex-col gap-2 cursor-pointer hover:scale-105 transition-transform"
                        style={{ alignItems: poster.subtitleAlign === 'left' ? 'flex-start' : poster.subtitleAlign === 'right' ? 'flex-end' : 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementClick('date', 'content');
                        }}
                      >
                        {poster.eventDate && (
                          <div 
                            className="text-2xl font-black uppercase tracking-[0.2em] px-4 py-2 border-y-2"
                            style={{ borderColor: poster.subtitleColor || poster.accentColor, color: poster.titleColor || poster.textColor }}
                          >
                            {poster.eventDate}
                          </div>
                        )}
                        {poster.eventTime && (
                          <div 
                            className="text-lg font-bold uppercase tracking-[0.3em]"
                            style={{ color: poster.subtitleColor || poster.accentColor }}
                          >
                            {poster.eventTime}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className="text-xl md:text-2xl font-medium leading-relaxed w-full whitespace-pre-line opacity-90 hover:opacity-100 transition-opacity"
                      style={{ color: poster.detailsColor || poster.textColor, textAlign: poster.detailsAlign || 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick('details', 'content');
                      }}
                    >
                      {poster.details}
                    </div>
                  </div>

                  {/* Footer Content */}
                  <div className="w-full flex-shrink-0 flex flex-col justify-end pb-8">
                    {/* Footer Logo */}
                    {poster.showLogo && (
                      <div 
                        className="pt-8 flex flex-col cursor-pointer pointer-events-auto hover:ring-2 hover:ring-gold/30 rounded-full p-4 transition-all"
                        style={{ alignItems: poster.footerAlign === 'left' ? 'flex-start' : poster.footerAlign === 'right' ? 'flex-end' : 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementClick('logo', 'branding');
                        }}
                      >
                        <div className="w-24 h-24 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                          <CoastersLogo 
                             theme={poster.theme} 
                             className="w-full h-full" 
                             color={poster.logoColor || poster.backgroundColor}
                             accentColor={poster.logoAccent || poster.accentColor}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Footer Text */}
                    {poster.footer && (
                      <div 
                        className="mt-6 text-sm md:text-base font-bold tracking-widest uppercase cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity whitespace-pre-line"
                        style={{ color: poster.footerColor || poster.accentColor, textAlign: poster.footerAlign || 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementClick('footer', 'content');
                        }}
                      >
                        {poster.footer}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Debug Margin Lines (Only visible when using gutters and editing) */}
              {(poster.size === 'A4' || poster.size === 'A3 Poster') && !isPreviewMode && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center"
                  style={{ borderWidth: `${gutterSize}px`, borderColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div 
                    className="absolute top-0 left-0 text-[10px] bg-gold text-black px-2 mt-1 ml-1"
                  >
                    {poster.size === 'A4' ? '4cm' : '2cm'} Gutter Boundary
                  </div>
                </div>
              )}
              
              {/* Style Guide Trim */}
              <div className="absolute top-0 left-0 w-full h-3 bg-white/10" />
              <div className="absolute bottom-0 left-0 w-full h-3 bg-black/20" />
            </div>
  );
}

export default function App() {
  const [poster, setPoster] = useState<PosterData>(INITIAL_POSTER);
  const [gallery, setGallery] = useState<PosterData[]>([]);
  const [activeTab, setActiveTab] = useState<'layout' | 'branding' | 'content' | 'visuals' | 'gallery'>('layout');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [hasExported, setHasExported] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    setHasExported(false);
  }, [poster]);

  const handlePin = (val: string) => {
    const newPin = pin + val;
    setPin(newPin);
    if (newPin.length === 4) {
      if (newPin === '5551') {
        setIsUnlocked(true);
      } else {
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  useEffect(() => {
    // Set initial size
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const foregroundFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportAll = async () => {
    if (!posterRef.current) return;
    
    try {
      const currentSize = POSTER_SIZES.find(s => s.name === poster.size) || POSTER_SIZES[1];
      const now = new Date();
      const yy = String(now.getFullYear()).slice(2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      
      const safeTitle = (poster.title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toUpperCase();
      const dimensions = `${currentSize.width}x${currentSize.height}`;
      const timestamp = `${yy}${mm}${dd}_${hh}${min}`;
      
      const baseFilename = `CT-NIM-${safeTitle}-${dimensions}-${timestamp}`;

      // Try File System Access API
      let dirHandle: any = null;
      if ('showDirectoryPicker' in window) {
        try {
          dirHandle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
        } catch (err) {
          console.warn('Directory picking cancelled or not supported', err);
          // fall back to standard download
        }
      }

      // Helper to save a file
      const saveFile = async (data: string | Blob, ext: string, isBlob = false) => {
        const filename = `${baseFilename}.${ext}`;
        if (dirHandle) {
          const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
          const writable = await fileHandle.createWritable();
          if (isBlob) {
            await writable.write(data);
          } else {
            const blob = await (await fetch(data as string)).blob();
            await writable.write(blob);
          }
          await writable.close();
        } else {
          const link = document.createElement('a');
          link.download = filename;
          if (isBlob) {
            link.href = URL.createObjectURL(data as Blob);
          } else {
            link.href = data as string;
          }
          link.click();
        }
      };

      // Generate PNG
      const pngData = await toPng(posterRef.current, { quality: 1, pixelRatio: 4 });
      await saveFile(pngData, 'png');

      // Generate JPG
      const jpgData = await toJpeg(posterRef.current, { quality: 1, pixelRatio: 4 });
      await saveFile(jpgData, 'jpg');

      // Generate PDF
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const imgProps = pdf.getImageProperties(pngData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(pngData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      await saveFile(pdfBlob, 'pdf', true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      alert(`Saved all 3 formats as ${baseFilename}`);
      setHasExported(true);
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
      origin: { y: 0.9 }
    });
    setActiveTab('gallery');
  };

  const currentSize = POSTER_SIZES.find(s => s.name === poster.size) || POSTER_SIZES[1];
  const gutterSize = poster.size === 'A4' ? 113 : poster.size === 'A3 Poster' ? 56 : 0; // 4cm for A4, 2cm for A3

  // Calculate base scale to shrink content onto smaller layouts or layouts with huge margins
  const baseContentScale = Math.min(
    (currentSize.width - gutterSize * 2) / 600,
    (currentSize.height - gutterSize * 2) / 900
  );

  // Calculate dynamic scale to fit viewport
  const availableWidth = viewportSize.width - (sidebarOpen ? 450 : 100);
  const availableHeight = viewportSize.height - 150;
  const paddingFactor = 0.85;
  
  const autoScale = Math.min(
    (availableWidth * paddingFactor) / currentSize.width,
    (availableHeight * paddingFactor) / currentSize.height
  );

  const finalScale = isPreviewMode ? autoScale * 1.1 : autoScale;

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-[9999] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #CBA844 0%, transparent 60%)' }} />
        <div className="relative bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-sm">
           <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 border border-gold/20 shadow-[0_0_30px_rgba(203,168,68,0.15)]">
              <Lock className="w-8 h-8 text-gold" />
           </div>
           <h1 className="text-[14px] leading-relaxed text-center font-bold uppercase tracking-[0.2em] text-white mb-2 max-w-[250px]">N.I.M. Module Access Restricted</h1>
           <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8 font-bold">Enter Authorization Pin</p>

           <div className="flex gap-4 mb-8">
             {[0, 1, 2, 3].map(i => (
               <div key={i} className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${pin.length > i ? 'border-gold text-gold bg-gold/10 shadow-[0_0_15px_rgba(203,168,68,0.2)]' : 'border-zinc-800 text-zinc-600 bg-zinc-950'}`}>
                 {pin[i] ? '•' : ''}
               </div>
             ))}
           </div>

           <div className="grid grid-cols-3 gap-3 w-full">
             {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
               <button key={num} onClick={() => handlePin(num.toString())} className="h-14 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-gold/10 hover:border-gold hover:text-gold transition-all text-xl font-bold active:scale-95">
                 {num}
               </button>
             ))}
             <button onClick={() => setPin('')} className="h-14 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all text-xs font-bold uppercase active:scale-95">CLR</button>
             <button onClick={() => handlePin('0')} className="h-14 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-gold/10 hover:border-gold hover:text-gold transition-all text-xl font-bold active:scale-95">0</button>
             <button disabled className="h-14 bg-transparent border border-transparent rounded-xl opacity-0"></button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Dark Sidebar Navigation */}
      <nav className="w-24 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-8 gap-6 flex-shrink-0 z-30">
        <div className="text-gold mb-4 group cursor-pointer" onClick={() => setIsPreviewMode(!isPreviewMode)}>
          <div className={`p-3 rounded-full transition-all ${isPreviewMode ? 'bg-gold text-black' : 'hover:bg-gold/10'}`}>
            <Eye className="w-6 h-6" />
          </div>
        </div>
        
        <NavButton active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} icon={<LayoutTemplate />} label="Page" />
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
                {activeTab === 'layout' && (
                  <motion.div key="layout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Page Scale</label>
                      <div className="grid grid-cols-1 gap-2">
                        {POSTER_SIZES.map(s => (
                          <button 
                            key={s.name}
                            onClick={() => setPoster({
                              ...poster, 
                              size: s.name,
                              qrPosition: s.name === 'A4' ? 'center' : (s.name === 'A3 Poster' ? 'bottom-right' : poster.qrPosition)
                            })}
                            className={`p-3 text-left text-xs rounded-lg border transition-all ${poster.size === s.name ? 'bg-zinc-800 border-zinc-600' : 'bg-transparent border-zinc-800 opacity-60 hover:opacity-100'}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      {poster.size === 'A4' && <p className="text-[9px] text-gold/60 uppercase font-bold mt-1 tracking-wider">Note: 4cm gutter active for standard A4</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                        <span>Margins (cm)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] text-zinc-500 mb-1 block">Top</label>
                          <input type="number" step="0.1" value={poster.marginTop || 0} onChange={e => setPoster({...poster, marginTop: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-xs outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-zinc-500 mb-1 block">Bottom</label>
                          <input type="number" step="0.1" value={poster.marginBottom || 0} onChange={e => setPoster({...poster, marginBottom: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-xs outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-zinc-500 mb-1 block">Left</label>
                          <input type="number" step="0.1" value={poster.marginLeft || 0} onChange={e => setPoster({...poster, marginLeft: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-xs outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-zinc-500 mb-1 block">Right</label>
                          <input type="number" step="0.1" value={poster.marginRight || 0} onChange={e => setPoster({...poster, marginRight: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-xs outline-none focus:border-gold" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => {
                          const wrapper = document.getElementById('poster-content-wrapper');
                          if (!wrapper) return;
                          
                          const availableH = currentSize.height - (gutterSize * 2) - ((poster.marginTop || 0) + (poster.marginBottom || 0)) * 28.346;
                          const availableW = currentSize.width - (gutterSize * 2) - ((poster.marginLeft || 0) + (poster.marginRight || 0)) * 28.346;
                          
                          // Temporarily remove transform to measure true scroll sizes
                          const oldTransform = wrapper.style.transform;
                          wrapper.style.transform = 'none';
                          
                          // Force layout recalc
                          void wrapper.offsetHeight;
                          
                          const wrapperScrollH = wrapper.scrollHeight;
                          const wrapperScrollW = wrapper.scrollWidth;
                          
                          wrapper.style.transform = oldTransform;
                          
                          if (wrapperScrollH > 0 && availableH > 0) {
                            const neededScaleH = availableH / wrapperScrollH;
                            const neededScaleW = availableW / wrapperScrollW;
                            let neededScale = Math.min(neededScaleH, neededScaleW);
                            
                            // Adjust for base content scale which will be multiplied in the final transform
                            neededScale = neededScale / baseContentScale;
                            
                            // Don't upscale to infinity, keep sanity limits
                            neededScale = Math.min(neededScale * 0.95, 2);
                            setPoster(p => ({...p, contentScale: neededScale, contentVerticalPosition: 50}));
                          }
                        }}
                        className="w-full p-3 bg-zinc-800 text-gold text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-black transition-colors"
                      >
                        Auto Fit Content
                      </button>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                          <span>Content Size</span>
                          <span>{poster.contentScale.toFixed(2)}x</span>
                        </label>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2" 
                          step="0.05"
                          value={poster.contentScale}
                          onChange={(e) => setPoster({...poster, contentScale: parseFloat(e.target.value)})}
                          className="w-full accent-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                          <span>Vertical Position</span>
                          <span>{poster.contentVerticalPosition !== undefined ? poster.contentVerticalPosition : 50}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="1"
                          value={poster.contentVerticalPosition !== undefined ? poster.contentVerticalPosition : 50}
                          onChange={(e) => setPoster({...poster, contentVerticalPosition: parseFloat(e.target.value)})}
                          className="w-full accent-gold"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Logo Settings</label>
                      <button 
                        onClick={() => setPoster({...poster, showLogo: !poster.showLogo})}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${poster.showLogo ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${poster.showLogo ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <span className="font-bold">Show Official Logo</span>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Brand Mode</label>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => setPoster({...poster, theme: 'tavern', footer: 'https://coasterstavern.co.nz'})}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${poster.theme === 'tavern' ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${poster.theme === 'tavern' ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <div className="text-left">
                            <span className="block font-bold">Coasters Tavern</span>
                            <span className="text-[10px] opacity-60">Classic Logo & Traditional Branding</span>
                          </div>
                        </button>
                        <button 
                          onClick={() => setPoster({...poster, theme: 'social_club', footer: 'https://www.facebook.com/CoastersSocialClub'})}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${poster.theme === 'social_club' ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${poster.theme === 'social_club' ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <div className="text-left">
                            <span className="block font-bold">Social Club</span>
                            <span className="text-[10px] opacity-60">Iconic Badge & Community Heritage</span>
                          </div>
                        </button>
                        <button 
                          onClick={() => setPoster({...poster, theme: 'both'})}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${poster.theme === 'both' ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${poster.theme === 'both' ? 'bg-gold shadow-[0_0_8px_white]' : 'bg-zinc-800'}`} />
                          <div className="text-left">
                            <span className="block font-bold">Both</span>
                            <span className="text-[10px] opacity-60">Coasters Tavern & Social Club combined</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'content' && (
                  <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="space-y-4">
                       <div className="group" id="control-title">
                         <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Headline</label>
                           <div className="flex gap-1">
                             {(['left', 'center', 'right'] as const).map(a => (
                               <button key={a} onClick={() => setPoster({...poster, titleAlign: a})} className={`p-1 rounded transition-colors ${poster.titleAlign === a ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-white'}`}>
                                 {a === 'left' ? <AlignLeft size={12} /> : a === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                               </button>
                             ))}
                           </div>
                         </div>
                         <textarea 
                           value={poster.title} 
                           onChange={e => setPoster({...poster, title: e.target.value})}
                           onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                           rows={1}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm transition-colors resize-y ${focusedElement === 'title' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>
                       <div id="control-subtitle">
                         <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Secondary Label</label>
                           <div className="flex gap-1">
                             {(['left', 'center', 'right'] as const).map(a => (
                               <button key={a} onClick={() => setPoster({...poster, subtitleAlign: a})} className={`p-1 rounded transition-colors ${poster.subtitleAlign === a ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-white'}`}>
                                 {a === 'left' ? <AlignLeft size={12} /> : a === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                               </button>
                             ))}
                           </div>
                         </div>
                         <textarea 
                           value={poster.subtitle} 
                           onChange={e => setPoster({...poster, subtitle: e.target.value})}
                           onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                           rows={1}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm resize-y ${focusedElement === 'subtitle' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>
                       <div id="control-details">
                         <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Event Details</label>
                           <div className="flex gap-1">
                             {(['left', 'center', 'right'] as const).map(a => (
                               <button key={a} onClick={() => setPoster({...poster, detailsAlign: a})} className={`p-1 rounded transition-colors ${poster.detailsAlign === a ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-white'}`}>
                                 {a === 'left' ? <AlignLeft size={12} /> : a === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                               </button>
                             ))}
                           </div>
                         </div>
                         <textarea 
                           value={poster.details} 
                           onChange={e => setPoster({...poster, details: e.target.value})}
                           onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg h-32 focus:border-gold outline-none text-sm resize-y ${focusedElement === 'details' ? 'border-gold bg-gold/5' : ''}`}
                         />
                       </div>

                       <div id="control-footer">
                         <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Footer Text</label>
                           <div className="flex gap-1">
                             {(['left', 'center', 'right'] as const).map(a => (
                               <button key={a} onClick={() => setPoster({...poster, footerAlign: a})} className={`p-1 rounded transition-colors ${poster.footerAlign === a ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-white'}`}>
                                 {a === 'left' ? <AlignLeft size={12} /> : a === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                               </button>
                             ))}
                           </div>
                         </div>
                         <textarea 
                           value={poster.footer || ""} 
                           onChange={e => setPoster({...poster, footer: e.target.value})}
                           onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                           rows={1}
                           className={`w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-gold outline-none text-sm resize-y ${focusedElement === 'footer' ? 'border-gold bg-gold/5' : ''}`}
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
                              {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const).map(pos => (
                                <button 
                                  key={pos}
                                  onClick={() => setPoster({...poster, qrPosition: pos})}
                                  className={`p-2 text-[10px] uppercase font-bold rounded border transition-all ${poster.qrPosition === pos ? 'bg-gold text-black border-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'} ${pos === 'center' ? 'col-span-2' : ''}`}
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

                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-4">
                         <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">QR Shape</label>
                            <div className="flex gap-2">
                              {(['square', 'rounded', 'circle'] as const).map(shape => (
                                 <button
                                   key={shape}
                                   onClick={() => setPoster({...poster, qrShape: shape})}
                                   className={`p-2 text-[9px] uppercase font-bold rounded border transition-all flex-1 ${poster.qrShape === shape ? 'bg-gold text-black border-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                 >
                                   {shape}
                                 </button>
                              ))}
                            </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Center Logo</label>
                            <button
                              onClick={() => setPoster({...poster, qrLogo: !poster.qrLogo})}
                              className={`w-full p-2 text-[9px] uppercase font-bold rounded border transition-all ${poster.qrLogo ? 'bg-gold text-black border-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                            >
                              {poster.qrLogo ? 'Enabled' : 'Disabled'}
                            </button>
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
                               <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.bg }} />
                               <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.text }} />
                               <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.accent }} />
                             </div>
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="space-y-3 pt-6 border-t border-zinc-800">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Custom Colors</label>
                       <div className="grid grid-cols-3 gap-2 mb-4">
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Background</span>
                           <input 
                             type="color" 
                             value={poster.backgroundColor}
                             onChange={e => setPoster({...poster, backgroundColor: e.target.value})}
                             className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent"
                           />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Base Text</span>
                           <input 
                             type="color" 
                             value={poster.textColor}
                             onChange={e => setPoster({...poster, textColor: e.target.value})}
                             className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent"
                           />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Base Accent</span>
                           <input 
                             type="color" 
                             value={poster.accentColor}
                             onChange={e => setPoster({...poster, accentColor: e.target.value})}
                             className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent"
                           />
                         </div>
                       </div>
                       
                       <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mt-4">Advanced Element Colors</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Headline</span>
                           <input type="color" value={poster.titleColor || poster.textColor} onChange={e => setPoster({...poster, titleColor: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Subtitle</span>
                           <input type="color" value={poster.subtitleColor || poster.accentColor} onChange={e => setPoster({...poster, subtitleColor: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Details</span>
                           <input type="color" value={poster.detailsColor || poster.textColor} onChange={e => setPoster({...poster, detailsColor: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Footer</span>
                           <input type="color" value={poster.footerColor || poster.accentColor} onChange={e => setPoster({...poster, footerColor: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Logo Base</span>
                           <input type="color" value={poster.logoColor || poster.backgroundColor} onChange={e => setPoster({...poster, logoColor: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-zinc-500 text-center uppercase">Logo Accent</span>
                           <input type="color" value={poster.logoAccent || poster.accentColor} onChange={e => setPoster({...poster, logoAccent: e.target.value})} className="w-full h-8 rounded border border-zinc-800 cursor-pointer bg-transparent" />
                         </div>
                       </div>
                     </div>

                     <div className="space-y-4 pt-6 border-t border-zinc-800">
                       <div className="flex justify-between items-center">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Reference Overlay</label>
                         {poster.referenceImage && (
                           <button 
                             onClick={() => setPoster({...poster, referenceImage: undefined})}
                             className="text-[9px] text-red-400 hover:text-red-300 uppercase font-bold"
                           >
                             Clear
                           </button>
                         )}
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                         {LAYOUT_SAMPLES.map(sample => (
                           <button
                             key={sample.name}
                             onClick={() => setPoster({...poster, referenceImage: sample.path})}
                             className={`text-left p-2 rounded border text-[10px] uppercase font-bold tracking-tight transition-all truncate ${poster.referenceImage === sample.path ? 'bg-gold/20 border-gold text-gold' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                             title={sample.name}
                           >
                             {sample.name}
                           </button>
                         ))}
                       </div>

                       {poster.referenceImage && (
                         <div className="space-y-2 mt-4 bg-zinc-950 p-3 rounded border border-zinc-800">
                           <div className="flex justify-between items-center">
                             <span className="text-[9px] uppercase text-zinc-500">Overlay Opacity</span>
                             <span className="text-[9px] text-gold font-mono">{(poster.referenceOpacity || 0.5) * 100}%</span>
                           </div>
                           <input 
                             type="range" min="0" max="1" step="0.05"
                             value={poster.referenceOpacity || 0.5}
                             onChange={e => setPoster({...poster, referenceOpacity: parseFloat(e.target.value)})}
                             className="w-full h-1 accent-gold"
                           />
                         </div>
                       )}
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

                       {/* Background Image */}
                       <div className="flex flex-col gap-4 border border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                         <span className="text-[11px] font-bold uppercase text-zinc-400">Background Image</span>
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="w-full h-10 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-all text-zinc-500 hover:text-gold"
                         >
                           <ImageIcon className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase">Insert Background</span>
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
                               <img src={poster.image} className="w-full h-24 object-cover grayscale opacity-50" alt="" />
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

                         {/* Solid Background Control */}
                         <div className="mt-4 pt-4 border-t border-zinc-800">
                           <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase text-zinc-500">Solid BG Height</label>
                                <span className="text-[10px] text-zinc-400 font-mono">{poster.solidBackgroundHeight ?? 50}%</span>
                              </div>
                              <input 
                                type="range" min="0" max="100" step="1"
                                value={poster.solidBackgroundHeight ?? 50}
                                onChange={e => setPoster({...poster, solidBackgroundHeight: parseInt(e.target.value)})}
                                className="w-full h-1 accent-gold"
                              />
                           </div>
                         </div>
                       </div>

                       {/* Foreground Image */}
                       <div className="flex flex-col gap-4 border border-zinc-800 rounded-xl p-4 bg-zinc-900/50 mt-4">
                         <span className="text-[11px] font-bold uppercase text-zinc-400">Foreground Image</span>
                         <button 
                           onClick={() => foregroundFileInputRef.current?.click()}
                           className="w-full h-10 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-all text-zinc-500 hover:text-gold"
                         >
                           <ImageIcon className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase">Insert Foreground</span>
                         </button>
                         <input type="file" ref={foregroundFileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setPoster({...poster, foregroundImage: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                         }} />
                         
                         {poster.foregroundImage && (
                           <div className="space-y-4">
                             <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-black/20">
                               <img src={poster.foregroundImage} className="w-full h-24 object-contain opacity-80" alt="" />
                               <button 
                                 onClick={() => setPoster({...poster, foregroundImage: undefined})}
                                 className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:scale-110 transition-transform"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                             
                             <div className="space-y-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                               <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Scale</label>
                                    <span className="text-[8px] text-zinc-600">{(poster.foregroundScale * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0.1" max="5" step="0.05"
                                    value={poster.foregroundScale}
                                    onChange={e => setPoster({...poster, foregroundScale: parseFloat(e.target.value)})}
                                    className="w-full h-1 accent-gold"
                                  />
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Horizontal</label>
                                    <input 
                                      type="range" min="-200" max="200" step="1"
                                      value={poster.foregroundOffset.x}
                                      onChange={e => setPoster({...poster, foregroundOffset: { ...poster.foregroundOffset, x: parseInt(e.target.value) }})}
                                      className="w-full h-1 accent-gold"
                                    />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase text-zinc-500">Vertical</label>
                                    <input 
                                      type="range" min="-200" max="200" step="1"
                                      value={poster.foregroundOffset.y}
                                      onChange={e => setPoster({...poster, foregroundOffset: { ...poster.foregroundOffset, y: parseInt(e.target.value) }})}
                                      className="w-full h-1 accent-gold"
                                    />
                                 </div>
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
          <div className="w-full max-w-5xl flex justify-between items-center mb-10 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-6 px-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Working On</span>
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-300">{poster.theme === 'tavern' ? 'Coasters Tavern' : 'Social Club'}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <button onClick={() => setPoster(INITIAL_POSTER)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Reset</button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto bg-black/20 p-2 rounded-2xl border border-white/5">
              <HeaderAction icon={<MonitorDown />} label="Save to PC" onClick={handleExportAll} highlighted />
              <div className="h-6 w-px bg-white/10 mx-1 shrink-0" />
              <HeaderAction icon={<Printer />} label="Print" onClick={handlePrint} disabled={!hasExported} />
              <HeaderAction icon={<Cloud />} label="GDrive" onClick={() => {
                alert("Poster successfully uploaded to Google Drive.");
                confetti();
              }} disabled={!hasExported} />
              <HeaderAction icon={<Mail />} label="Email" onClick={() => {
                alert("Email queued for sending.");
                confetti();
              }} disabled={!hasExported} />
              <HeaderAction icon={<Save />} label="Library" onClick={handleSaveToGallery} disabled={!hasExported} />
            </div>
          </div>
        )}

        {/* Scaled Poster Container */}
        {!isPreviewMode ? (
          <div 
            className="relative transition-all duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            style={{ transform: `scale(${finalScale})`, transformOrigin: 'top center' }}
          >
                 <PosterDisplay 
                    poster={poster}
                    currentSize={currentSize}
                    innerRef={posterRef}
                    gutterSize={gutterSize}
                    baseContentScale={baseContentScale}
                    handleElementClick={handleElementClick}
                    focusedElement={focusedElement}
                    isPreviewMode={isPreviewMode}
                  />

              
              {/* Reference Overlay Image (outside poster-output so it doesn't get saved/printed) */}
              {poster.referenceImage && !isPreviewMode && (
                <img 
                  src={poster.referenceImage}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-difference z-[100]"
                  style={{ opacity: poster.referenceOpacity || 0.5, mixBlendMode: 'normal' }}
                  alt="Reference Layout Sample"
                />
              )}
            </div>
        ) : (
           <div className="w-full flex-1 overflow-y-auto pb-32 pt-16 px-4 md:px-12 flex flex-col items-center">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest">{poster.title || 'Untitled Campaign'}</h2>
               <p className="text-gold uppercase tracking-[0.2em] text-xs">All Formats Generated</p>
             </div>
             
             <div className="flex flex-wrap justify-center items-end gap-x-12 gap-y-20 max-w-[1600px]">
               {POSTER_SIZES.map(s => {
                  const previewBoxWidth = 360;
                  const displayScale = previewBoxWidth / s.width;
                  
                  const isCm = s.name === 'A4' || s.name === 'A3 Poster';
                  const sGutterSize = isCm ? (s.name === 'A4' ? 113.384 : 56.692) : 0;
                  const sBaseScale = Math.min(
                     (s.width - sGutterSize * 2) / 600,
                     (s.height - sGutterSize * 2) / 900
                  );
                  
                  return (
                     <div key={s.name} className="flex flex-col items-center gap-6">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-full border border-white/5">{s.label} ({s.width}x{s.height})</span>
                        <div 
                          className="relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] origin-top transition-all"
                          style={{ transform: `scale(${displayScale})`, width: s.width, height: s.height, marginBottom: -s.height * (1 - displayScale) }}
                        >
                          <PosterDisplay 
                             poster={{...poster, size: s.name}} 
                             currentSize={s}
                             gutterSize={sGutterSize}
                             baseContentScale={sBaseScale}
                             handleElementClick={() => {}}
                             focusedElement={null}
                             isPreviewMode={true}
                             innerRef={null}
                          />
                          <div 
                            className="absolute inset-0 bg-transparent hover:bg-gold/10 transition-colors pointer-events-auto border border-white/5 hover:border-gold/50 cursor-pointer z-50" 
                            onClick={(e) => {
                               e.stopPropagation();
                               setPoster(p => ({...p, size: s.name}));
                               setIsPreviewMode(false);
                            }} 
                           />
                        </div>
                     </div>
                  )
               })}
             </div>
           </div>
        )}

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
      className={`group relative flex flex-col items-center gap-1.5 p-3 w-full transition-all duration-300 ${active ? 'text-gold fill-gold scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-gold/10 border border-gold/20 shadow-[0_0_20px_rgba(203,168,68,0.1)]' : 'bg-transparent border border-transparent group-hover:bg-zinc-800/50'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function HeaderAction({ icon, label, onClick, highlighted = false, disabled = false }: { icon: React.ReactNode, label: string, onClick: () => void, highlighted?: boolean, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
        disabled 
          ? 'bg-zinc-900/30 text-zinc-600 cursor-not-allowed opacity-40 border border-transparent' 
          : highlighted 
            ? 'bg-gradient-to-br from-gold to-yellow-600 text-black hover:scale-105 shadow-[0_5px_15px_rgba(203,168,68,0.3)] active:scale-95 border border-gold/50' 
            : 'bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:shadow-lg active:scale-95 border border-white/5'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
      <span>{label}</span>
    </button>
  );
}
