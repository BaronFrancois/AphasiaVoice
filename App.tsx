import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NEEDS_OPTIONS, EMOTIONS_OPTIONS, AVAILABLE_ICONS, PRESET_TILES } from './constants';
import { QuickWord } from './types';
import SpeechButton from './components/SpeechButton';
import NavBar from './components/NavBar';
import { Settings, X, ArrowRight, Check, AlertTriangle, Plus, Layout, LogOut } from 'lucide-react';

// Color palette for custom tiles
const TILE_COLORS = [
  { id: 'red', name: 'Rouge', bg: 'bg-red-600', text: 'text-white' },
  { id: 'green', name: 'Vert', bg: 'bg-green-600', text: 'text-white' },
  { id: 'blue', name: 'Bleu', bg: 'bg-blue-600', text: 'text-white' },
  { id: 'yellow', name: 'Jaune', bg: 'bg-yellow-500', text: 'text-black' },
  { id: 'orange', name: 'Orange', bg: 'bg-orange-600', text: 'text-white' },
  { id: 'purple', name: 'Violet', bg: 'bg-purple-600', text: 'text-white' },
  { id: 'slate', name: 'Gris', bg: 'bg-slate-600', text: 'text-white' },
];

const INITIAL_PAGES: QuickWord[][] = [
  NEEDS_OPTIONS,      // Page 1: Besoins vitaux
  EMOTIONS_OPTIONS    // Page 2: Émotions / Relationnel
];

const App: React.FC = () => {
  // -- Data State --
  const [pages, setPages] = useState<QuickWord[][]>(INITIAL_PAGES);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // -- Edit / Dev Mode State --
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [draftPages, setDraftPages] = useState<QuickWord[][]>(INITIAL_PAGES);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAddTileModal, setShowAddTileModal] = useState(false);

  // -- Auth Inputs --
  const [sliderValue, setSliderValue] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockStep, setUnlockStep] = useState<'slide' | 'pin'>('slide');

  // -- New Tile Form --
  const [newTileLabel, setNewTileLabel] = useState('');
  const [newTileSpeak, setNewTileSpeak] = useState('');
  const [newTileColor, setNewTileColor] = useState(TILE_COLORS[2]);
  const [newTileSize, setNewTileSize] = useState<1 | 2>(1);
  const [newTileIcon, setNewTileIcon] = useState<string | null>(null);

  // -- Custom Drag & Drop State --
  const [draggingTile, setDraggingTile] = useState<QuickWord | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for Drag Logic
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragItemRef = useRef<QuickWord | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const edgeScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollDirectionRef = useRef<'left' | 'right' | null>(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Refs for Swipe Logic (Navigation)
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('aphasia_app_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPages(parsed);
      } catch (e) {}
    }
  }, []);

  const saveToStorage = (data: QuickWord[][]) => {
    setPages(data);
    localStorage.setItem('aphasia_app_data_v2', JSON.stringify(data));
  };

  // --- Helpers ---
  const visiblePageMapping = useMemo(() => {
    const currentData = isDevMode ? draftPages : pages;
    const indices: number[] = [];
    currentData.forEach((page, idx) => {
        if (isDevMode || page.length > 0) indices.push(idx);
    });
    if (isDevMode) {
        const lastIdx = currentData.length - 1;
        if (lastIdx < 0 || currentData[lastIdx].length > 0) indices.push(currentData.length); 
    }
    return indices;
  }, [isDevMode, pages, draftPages]);

  const getCurrentDraftPage = () => {
    return (currentPageIndex < draftPages.length) ? draftPages[currentPageIndex] : [];
  };

  const updateCurrentDraftPage = (newTiles: QuickWord[]) => {
    setDraftPages(prev => {
        const newPages = [...prev];
        newPages[currentPageIndex] = newTiles;
        return newPages;
    });
  };

  const getIconComponent = (name?: string) => {
    if (!name) return undefined;
    const found = AVAILABLE_ICONS.find(i => i.id === name);
    return found ? found.icon : undefined;
  };

  // --- Custom Drag & Drop Implementation ---

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (!isDevMode) return;
    
    // Don't prevent default yet, allow for scrolling or clicking
    const tile = getCurrentDraftPage().find(t => t.id === id);
    if (!tile) return;

    // Start Long Press Timer
    longPressTimerRef.current = setTimeout(() => {
        // ENTER DRAG MODE
        if (navigator.vibrate) navigator.vibrate(50);
        setIsDragging(true);
        setDraggingTile(tile);
        dragItemRef.current = tile;

        // Calculate offset so the tile doesn't snap to center of finger immediately
        // We want it to look like we grabbed it exactly where we touched
        const rect = (e.target as Element).closest('[data-tile-id]')?.getBoundingClientRect();
        if (rect) {
            dragOffsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            // Initial position
            setDragPosition({ x: rect.left, y: rect.top });
        }
    }, 400); // 400ms long press to activate drag
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
    // If not dragging, check for canceling long press if moved too much (handled in button logic ideally, but simpler here: if we move, we might scroll)
    // Actually, native scrolling usually cancels pointer events on some browsers, but let's handle "move" during the wait.
    
    if (!isDragging) {
        // If user scrolls significantly, cancel long press
        return; 
    }

    // Update Drag Position
    // Center the ghost tile on finger or use offset?
    // Using offset gives a "physical" feel
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    setDragPosition({ x: newX, y: newY });
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    // 1. Detect Edge for Pagination
    const edgeThreshold = 60;
    const screenWidth = window.innerWidth;
    
    if (e.clientX < edgeThreshold) {
        scrollDirectionRef.current = 'left';
    } else if (e.clientX > screenWidth - edgeThreshold) {
        scrollDirectionRef.current = 'right';
    } else {
        scrollDirectionRef.current = null;
        if (edgeScrollTimerRef.current) {
            clearTimeout(edgeScrollTimerRef.current);
            edgeScrollTimerRef.current = null;
        }
    }

    // Trigger edge scroll timer if not running
    if (scrollDirectionRef.current && !edgeScrollTimerRef.current) {
        edgeScrollTimerRef.current = setTimeout(() => {
            handleEdgeScroll();
        }, 1000); // 1 second hold at edge
    }

    // 2. Detect Swap Target
    // We use elementFromPoint to find what's under the finger
    // We hide the ghost tile momentarily or offset check? 
    // Actually pointer-events: none on the ghost tile handles this.
    const targetEl = document.elementFromPoint(e.clientX, e.clientY);
    const tileEl = targetEl?.closest('[data-tile-id]');
    
    if (tileEl) {
        const targetId = tileEl.getAttribute('data-tile-id');
        if (targetId && dragItemRef.current && targetId !== dragItemRef.current.id) {
            handleTileSwap(dragItemRef.current.id, targetId);
        }
    }
  };

  const handleGlobalPointerUp = () => {
    // Clear long press timer
    if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
    }

    // Clear edge scroll timer
    if (edgeScrollTimerRef.current) {
        clearTimeout(edgeScrollTimerRef.current);
        edgeScrollTimerRef.current = null;
    }

    if (isDragging) {
        setIsDragging(false);
        setDraggingTile(null);
        dragItemRef.current = null;
        scrollDirectionRef.current = null;
    }
  };

  const handleEdgeScroll = () => {
      const direction = scrollDirectionRef.current;
      if (!direction) return;

      const currentMapIndex = visiblePageMapping.indexOf(currentPageIndex);
      
      if (direction === 'right') {
          if (currentMapIndex < visiblePageMapping.length - 1) {
              const nextPageIndex = visiblePageMapping[currentMapIndex + 1];
              setCurrentPageIndex(nextPageIndex);
              // Move tile to new page? 
              // The prompt implies "pagination during drag".
              // Moving the tile across pages is complex. 
              // For now, let's just switch the view. The user can then drop the tile on the new page?
              // Implementing "Move tile to other page" requires removing from Page A and adding to Page B.
              // Let's implement that:
              moveDraggingTileToPage(nextPageIndex);
          }
      } else if (direction === 'left') {
          if (currentMapIndex > 0) {
              const prevPageIndex = visiblePageMapping[currentMapIndex - 1];
              setCurrentPageIndex(prevPageIndex);
              moveDraggingTileToPage(prevPageIndex);
          }
      }
      
      // Reset timer to allow continuous scrolling if holding?
      // For safety, require re-entry of edge zone.
      scrollDirectionRef.current = null; 
      if (edgeScrollTimerRef.current) clearTimeout(edgeScrollTimerRef.current);
      edgeScrollTimerRef.current = null;
  };

  const moveDraggingTileToPage = (targetPageIndex: number) => {
      if (!dragItemRef.current) return;
      const tileId = dragItemRef.current.id;
      
      setDraftPages(prev => {
          const newDraft = [...prev];
          
          // Remove from source (find it anywhere to be safe, but it should be currentPageIndex before switch)
          // Actually, we need to know where it came from. 
          // Simplified: We assume it's on the page we just left.
          
          // Remove from ALL pages first to be safe (prevents duplication)
          const tile = dragItemRef.current!;
          const cleanedPages = newDraft.map(p => p.filter(t => t.id !== tileId));
          
          // Add to target page
          cleanedPages[targetPageIndex] = [...cleanedPages[targetPageIndex], tile];
          
          return cleanedPages;
      });
  };

  const handleTileSwap = (id1: string, id2: string) => {
    const currentTiles = [...getCurrentDraftPage()];
    const index1 = currentTiles.findIndex(t => t.id === id1);
    const index2 = currentTiles.findIndex(t => t.id === id2);
    
    if (index1 !== -1 && index2 !== -1) {
      const temp = currentTiles[index1];
      currentTiles[index1] = currentTiles[index2];
      currentTiles[index2] = temp;
      updateCurrentDraftPage(currentTiles);
    }
  };

  // --- Auth / Dev Logic ---
  const handleUnlock = () => {
    if (passwordInput === '1234') {
      setShowAuthModal(false);
      setPasswordInput('');
      setSliderValue(0);
      setUnlockStep('slide');
      setDraftPages(JSON.parse(JSON.stringify(pages)));
      setIsDevMode(true);
    } else {
      alert('Code incorrect');
      setPasswordInput('');
    }
  };

  const handleSaveAndExit = () => {
    const cleaned = draftPages.filter(p => p.filter(x => x).length > 0);
    const final = cleaned.length > 0 ? cleaned : [[]];
    saveToStorage(final);
    setIsDevMode(false);
    setShowExitConfirm(false);
  };

  const handleDiscardAndExit = () => {
    setIsDevMode(false);
    setShowExitConfirm(false);
  };

  const removeTile = (id: string) => {
    const currentTiles = getCurrentDraftPage();
    updateCurrentDraftPage(currentTiles.filter(t => t.id !== id));
  };

  const resizeTile = (id: string) => {
    const currentTiles = getCurrentDraftPage();
    updateCurrentDraftPage(currentTiles.map(t => {
        if (t.id === id) return { ...t, colSpan: t.colSpan === 2 ? 1 : 2 };
        return t;
    }));
  };

  const addPresetToPage = (preset: typeof PRESET_TILES[0]) => {
    const tile: QuickWord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        label: preset.label,
        speakText: preset.speak,
        color: preset.color,
        bgColor: preset.bg,
        textColor: preset.text,
        colSpan: 1,
        iconName: preset.iconName
    };
    const currentTiles = getCurrentDraftPage();
    updateCurrentDraftPage([...currentTiles, tile]);
  };

    const addTileToCurrentPage = () => {
    if (!newTileLabel) return;
    
    const tile: QuickWord = {
      id: Date.now().toString(),
      label: newTileLabel,
      speakText: newTileSpeak || newTileLabel,
      color: newTileColor.id,
      bgColor: newTileColor.bg,
      textColor: newTileColor.text,
      colSpan: newTileSize,
      iconName: newTileIcon || undefined
    };

    const currentTiles = getCurrentDraftPage();
    updateCurrentDraftPage([...currentTiles, tile]);
    
    setNewTileLabel('');
    setNewTileSpeak('');
    setNewTileSize(1);
    setNewTileIcon(null);
    setShowAddTileModal(false);
  };

  // --- Standard Swipe (User Mode) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDevMode) return; // Disable swipe nav in dev mode to prevent conflicts
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDevMode) return;
    touchEndRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (isDevMode) return;
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const visiblePages = visiblePageMapping;
    const currentMapIndex = visiblePages.indexOf(currentPageIndex);
    if (isLeftSwipe && currentMapIndex < visiblePages.length - 1) setCurrentPageIndex(visiblePages[currentMapIndex + 1]);
    if (isRightSwipe && currentMapIndex > 0) setCurrentPageIndex(visiblePages[currentMapIndex - 1]);
    touchStartRef.current = null;
    touchEndRef.current = null;
  };


  // --- Render ---
  const currentTiles = isDevMode ? getCurrentDraftPage() : (pages[currentPageIndex] || []);
  const isSingleScreen = currentTiles.length === 1;
  const isSplitScreen = currentTiles.length === 2 && currentTiles.every(t => t.colSpan === 2);
  const isFullScreenMode = !isDevMode && (isSingleScreen || isSplitScreen);

  let gridClasses = "grid gap-6 p-4 h-full w-full overflow-y-auto content-start";
  if (isFullScreenMode) {
      gridClasses = isSingleScreen 
        ? "grid gap-6 p-4 h-full w-full grid-cols-1 grid-rows-1" 
        : "grid gap-6 p-4 h-full w-full grid-cols-1 grid-rows-2";
  } else {
      gridClasses = "grid gap-4 p-4 w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[minmax(140px,1fr)] overflow-y-auto content-start pb-20";
  }

  // Ghost Tile Component
  const GhostTile = () => {
      if (!draggingTile || !isDragging) return null;
      const Icon = getIconComponent(draggingTile.iconName) || draggingTile.icon;
      return (
          <div 
            className="fixed z-[100] pointer-events-none opacity-90 shadow-2xl scale-105"
            style={{ 
                left: dragPosition.x, 
                top: dragPosition.y,
                width: isFullScreenMode ? '300px' : '160px', // Approximate sizes
                height: isFullScreenMode ? '300px' : '160px'
            }}
          >
             <div className={`w-full h-full rounded-3xl ${draggingTile.bgColor} flex flex-col items-center justify-center border-4 border-white/50`}>
                {Icon && <Icon size={48} className="text-white mb-2" />}
                <span className="text-white font-bold text-xl uppercase">{draggingTile.label}</span>
             </div>
          </div>
      );
  };

  return (
    <div 
        className="h-[100dvh] w-full flex flex-col bg-slate-900 select-none overflow-hidden touch-none"
        onPointerMove={isDevMode ? handleGlobalPointerMove : undefined}
        onPointerUp={isDevMode ? handleGlobalPointerUp : undefined}
        onPointerCancel={isDevMode ? handleGlobalPointerUp : undefined}
        onTouchStart={!isDevMode ? handleTouchStart : undefined}
        onTouchMove={!isDevMode ? handleTouchMove : undefined}
        onTouchEnd={!isDevMode ? handleTouchEnd : undefined}
    >
      <GhostTile />

      {/* Header with Safe Area support */}
      <header className="safe-area-top h-auto shrink-0 bg-slate-900 border-b border-slate-800 z-50">
        <div className="h-16 flex items-center justify-between px-6">
            <h1 className="text-2xl font-black tracking-tighter">
            <span className="text-sky-400">VOICE</span>
            <span className="text-slate-100">APHASIA</span>
            </h1>
            {isDevMode ? (
            <button onClick={() => isDevMode && (JSON.stringify(draftPages) !== JSON.stringify(pages) ? setShowExitConfirm(true) : setIsDevMode(false))} className="bg-slate-800 text-slate-200 px-6 py-2 rounded-xl font-bold border border-slate-700 active:scale-95 transition-transform">
                Terminer
            </button>
            ) : (
            <button onClick={() => setShowAuthModal(true)} className="bg-slate-800 text-slate-200 px-6 py-2 rounded-xl font-bold border border-slate-700 active:scale-95 transition-transform flex items-center gap-2">
                <Settings size={20} />
                <span>Modifier</span>
            </button>
            )}
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 min-h-0 relative flex flex-col">
        {!isDevMode && currentTiles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                <Layout size={64} className="mb-4" />
                <p>Page vide</p>
            </div>
        )}

        <div className={gridClasses}>
            {currentTiles.map((tile) => (
                <div key={tile.id} className={`${tile.colSpan === 2 ? 'col-span-2' : 'col-span-1'} transition-all duration-300 ${isDragging && tile.id === draggingTile?.id ? 'opacity-0' : 'opacity-100'}`}>
                    <SpeechButton 
                        {...tile}
                        icon={getIconComponent(tile.iconName) || tile.icon}
                        fullHeight={isFullScreenMode}
                        isEditing={isDevMode}
                        onRemove={() => removeTile(tile.id)}
                        onResize={() => resizeTile(tile.id)}
                        onPointerDown={handlePointerDown}
                    />
                </div>
            ))}
            {isDevMode && (
                <button onClick={() => setShowAddTileModal(true)} className="h-full min-h-[140px] border-4 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-400/50 hover:bg-slate-800/50 transition-all active:scale-95">
                    <Plus size={48} strokeWidth={3} />
                    <span className="font-bold mt-2">Ajouter</span>
                </button>
            )}
        </div>
      </main>

      {/* Admin Library */}
      {isDevMode && (
        <div className="shrink-0 bg-slate-950 border-t-2 border-slate-800 p-2 pb-safe z-40 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bibliothèque Rapide</span>
                 <span className="text-xs text-slate-600">Appuyer pour ajouter</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
                {PRESET_TILES.map((preset, idx) => {
                    const PresetIcon = getIconComponent(preset.iconName);
                    return (
                        <div key={idx} onClick={() => addPresetToPage(preset)} className="shrink-0 w-20 h-20 bg-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer active:scale-95 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all shadow-md">
                            {PresetIcon && <PresetIcon size={24} className={`${preset.text === 'text-black' ? 'text-yellow-500' : 'text-slate-300'} mb-1`} />}
                            <span className="text-[10px] font-bold text-slate-300 uppercase truncate w-full text-center px-1">{preset.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {/* Footer */}
      <NavBar currentPage={currentPageIndex} pageCount={visiblePageMapping.length} setPage={(idx) => setCurrentPageIndex(visiblePageMapping[idx])} isDevMode={isDevMode} />

      {/* Modals */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowAuthModal(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="text-sky-400" /> Mode Administrateur</h3>
                    <button onClick={() => setShowAuthModal(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                {unlockStep === 'slide' ? (
                     <div className="relative h-16 bg-slate-800 rounded-full overflow-hidden border border-slate-700 select-none">
                        <div className="absolute inset-y-0 left-0 bg-sky-500/20 w-full flex items-center justify-center">
                            <span className="text-sky-400/50 font-bold tracking-widest text-sm animate-pulse">GLISSER POUR DÉVERROUILLER</span>
                        </div>
                        <div 
                            className="absolute top-1 bottom-1 w-14 bg-sky-500 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform duration-75"
                            style={{ transform: `translateX(${sliderValue}px)` }}
                            onTouchMove={(e) => {
                                const touch = e.targetTouches[0];
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (rect) {
                                    let val = touch.clientX - rect.left - 28;
                                    const max = rect.width - 60;
                                    if (val < 0) val = 0;
                                    if (val > max) val = max;
                                    setSliderValue(val);
                                    if (val >= max - 5) {
                                        setUnlockStep('pin');
                                        setSliderValue(0);
                                    }
                                }
                            }}
                            onMouseDown={(e) => {
                                const startX = e.clientX;
                                const handleMouseMove = (me: MouseEvent) => {
                                    const diff = me.clientX - startX;
                                    const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                                    if (rect) {
                                        const max = rect.width - 60;
                                        let val = diff;
                                        if (val < 0) val = 0;
                                        if (val > max) val = max;
                                        setSliderValue(val);
                                        if (val >= max - 5) {
                                            setUnlockStep('pin');
                                            setSliderValue(0);
                                            document.removeEventListener('mousemove', handleMouseMove);
                                        }
                                    }
                                };
                                const handleMouseUp = () => {
                                    setSliderValue(0);
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            }}
                        >
                            <ArrowRight color="white" size={24} />
                        </div>
                     </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center text-slate-400 text-sm mb-2">Entrez le code PIN (1234)</div>
                        <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full text-center text-4xl tracking-[1em] font-mono bg-slate-800 border-b-2 border-sky-500 text-white py-2 focus:outline-none rounded-t-lg" autoFocus />
                        <button onClick={handleUnlock} className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-sky-400 active:scale-95 transition-all shadow-lg shadow-sky-500/20">Valider</button>
                    </div>
                )}
            </div>
        </div>
      )}

      {showAddTileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <h3 className="text-xl font-bold text-white">Ajouter un bouton</h3>
                    <button onClick={() => setShowAddTileModal(false)} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2"><label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Texte</label><input type="text" value={newTileLabel} onChange={e => setNewTileLabel(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-white text-lg focus:border-sky-500 focus:outline-none" /></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Couleur</label><div className="flex flex-wrap gap-3">{TILE_COLORS.map(c => (<button key={c.id} onClick={() => setNewTileColor(c)} className={`w-12 h-12 rounded-full ${c.bg} border-4 transition-transform ${newTileColor.id === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'}`} />))}</div></div>
                    <div className="space-y-2"><label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Icône</label><div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-800 rounded-xl border-inner">{AVAILABLE_ICONS.map(({ id, icon: Icon }) => (<button key={id} onClick={() => setNewTileIcon(id)} className={`aspect-square rounded-lg flex items-center justify-center transition-all ${newTileIcon === id ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}><Icon size={24} /></button>))}</div></div>
                    <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl"><span className="font-bold text-slate-300">Grande taille</span><button onClick={() => setNewTileSize(s => s === 1 ? 2 : 1)} className={`w-14 h-8 rounded-full relative transition-colors ${newTileSize === 2 ? 'bg-sky-500' : 'bg-slate-600'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${newTileSize === 2 ? 'left-7' : 'left-1'}`} /></button></div>
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10"><button onClick={addTileToCurrentPage} disabled={!newTileLabel} className="w-full bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition-all">Ajouter</button></div>
            </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
                <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Sauvegarder ?</h3>
                <div className="space-y-3 mt-8"><button onClick={handleSaveAndExit} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Check size={20} /> Oui</button><button onClick={handleDiscardAndExit} className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><LogOut size={20} /> Non</button><button onClick={() => setShowExitConfirm(false)} className="w-full text-slate-500 font-bold py-2">Annuler</button></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;