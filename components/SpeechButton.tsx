import React, { useCallback, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useButtonPress } from '../hooks/useButtonPress';

interface SpeechButtonProps {
  id?: string;
  label: string;
  speakText: string;
  bgColor: string;
  textColor: string;
  icon?: LucideIcon;
  fullHeight?: boolean;
  onClickAnimation?: () => void;
  className?: string;
  
  // Edit Mode Props
  isEditing?: boolean;
  isSelected?: boolean;
  onRemove?: () => void;
  onResize?: () => void;
  colSpan?: number;
  onClick?: () => void;
  onUse?: () => void;
  
  // Custom Pointer Events for Drag
  onPointerDown?: (e: React.PointerEvent, id: string) => void;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  id,
  label,
  speakText,
  bgColor,
  textColor,
  icon: Icon,
  fullHeight = false,
  onClickAnimation,
  className = '',
  isEditing = false,
  isSelected = false,
  onRemove,
  onResize,
  colSpan = 1,
  onClick,
  onUse,
  onPointerDown
}) => {
  const [isPressing, setIsPressing] = useState(false);

  // Speech synthesis function
  const speakMessage = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (onClickAnimation) onClickAnimation();
    if (onUse) onUse();

    const synth = window.speechSynthesis;
    // Force voices resolution on iOS/Safari
    const availableVoices = synth.getVoices();
    const frenchVoice = availableVoices.find(
      (voice) => voice.lang?.toLowerCase().startsWith('fr')
    );

    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    if (frenchVoice) utterance.voice = frenchVoice;

    synth.cancel();
    synth.speak(utterance);
  }, [speakText, onClickAnimation, onUse]);

  // Button press handlers with tremor filtering and haptic feedback
  const buttonPressHandlers = useButtonPress({
    onPress: speakMessage,
    onPressStart: () => setIsPressing(true),
    onPressEnd: () => setIsPressing(false),
    onPressCancel: () => setIsPressing(false),
    minPressDuration: 60, // ultra-réactif pour valider quasi immédiatement
    moveThreshold: 30,
    verticalTolerance: 0.7 // Allow 70% more downward movement
  });

  // Legacy click handler for edit mode
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isEditing && onClick) {
      onClick();
    }
  }, [isEditing, onClick]);

  return (
    <div
      data-tile-id={id}
      className={`relative ${fullHeight ? 'h-full' : 'h-full min-h-[140px]'} w-full ${className}`}
    >
      <button
        onPointerDown={(e) => {
            if (isEditing && onPointerDown && id) {
                onPointerDown(e, id);
            } else if (!isEditing) {
                buttonPressHandlers.onPointerDown(e);
            }
        }}
        onPointerMove={(e) => {
            if (!isEditing) {
                buttonPressHandlers.onPointerMove(e);
            }
        }}
        onPointerUp={(e) => {
            if (!isEditing) {
                buttonPressHandlers.onPointerUp(e);
            }
        }}
        onPointerCancel={(e) => {
            if (!isEditing) {
                buttonPressHandlers.onPointerCancel(e);
            }
        }}
        onClick={handleClick}
        className={`
          w-full h-full
          ${bgColor} ${textColor}
          flex flex-col items-center justify-center
          transition-all duration-100
          touch-none select-none
          border-b-[6px] border-black/20
          relative overflow-hidden
          rounded-3xl
          shadow-lg
          ${!isEditing && !isPressing ? 'active:border-b-0 active:translate-y-[6px] active:shadow-none' : ''}
          ${isPressing && !isEditing ? 'scale-95 brightness-90' : ''}
          ${isEditing ? 'cursor-grab border-dashed border-4 border-white/30' : ''}
          ${isSelected ? 'ring-4 ring-yellow-400 scale-95 opacity-90 z-10' : ''}
        `}
      >
        {Icon && <Icon size={64} className={`mb-4 ${isEditing ? 'opacity-50' : 'opacity-90'} pointer-events-none transition-opacity filter drop-shadow-md`} strokeWidth={2.5} />}
        
        <span className={`text-3xl sm:text-4xl font-bold uppercase tracking-wider text-center px-4 leading-tight pointer-events-none select-none drop-shadow-sm ${isEditing ? 'opacity-70' : ''}`}>
          {label}
        </span>
      </button>

      {/* Edit Overlay Controls - Only show when NOT dragging, handled by parent usually, but kept here for tap interactions */}
      {isEditing && !isSelected && (
        <>
          {/* Remove Button */}
          {onRemove && (
            <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-3 shadow-xl border-4 border-slate-800 z-20 hover:scale-110 transition-transform"
            >
                <X size={20} strokeWidth={3} />
            </button>
          )}

          {/* Resize Button */}
          {onResize && (
             <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onResize();
                }}
                className="absolute -bottom-2 -left-2 bg-blue-500 text-white rounded-full p-3 shadow-xl border-4 border-slate-800 z-20 hover:scale-110 transition-transform"
             >
                {colSpan === 2 ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
             </button>
          )}
        </>
      )}
      
      {/* Ghost overlay when selected/dragged is handled by parent, 
          but we show a highlight here if it is the source of the drag 
      */}
      {isSelected && (
        <div className="absolute inset-0 bg-black/20 rounded-3xl pointer-events-none" />
      )}
    </div>
  );
};

export default SpeechButton;
