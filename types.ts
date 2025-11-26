import type { LucideIcon } from 'lucide-react';

export type ViewMode = 'binary' | 'needs' | 'custom';

export interface QuickWord {
  id: string;
  label: string;
  speakText: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon?: LucideIcon;     // For static internal icons
  iconName?: string;     // For serializable custom icons
  colSpan?: number;      // 1 (default) or 2
}

export interface GeminiResponse {
  text: string;
}