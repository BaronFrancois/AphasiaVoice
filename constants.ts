import { Check, X, GlassWater, Accessibility, Activity, Moon, Utensils, ThumbsUp, ThumbsDown, HelpCircle, Tv, Home, Phone, Heart, Star, Music, User, Car, Plane, Book, Gamepad2, Coffee, Sun, Cloud, Hand, Smile, Frown, LogOut, ArrowRightCircle } from 'lucide-react';
import { QuickWord } from './types';

// Available icons for the picker
export const AVAILABLE_ICONS = [
  { id: 'thumbs-up', icon: ThumbsUp, label: 'Pouce haut' },
  { id: 'thumbs-down', icon: ThumbsDown, label: 'Pouce bas' },
  { id: 'home', icon: Home, label: 'Maison' },
  { id: 'user', icon: User, label: 'Personne' },
  { id: 'heart', icon: Heart, label: 'Cœur' },
  { id: 'star', icon: Star, label: 'Etoile' },
  { id: 'tv', icon: Tv, label: 'TV' },
  { id: 'phone', icon: Phone, label: 'Téléphone' },
  { id: 'music', icon: Music, label: 'Musique' },
  { id: 'book', icon: Book, label: 'Livre' },
  { id: 'game', icon: Gamepad2, label: 'Jeu' },
  { id: 'car', icon: Car, label: 'Voiture' },
  { id: 'coffee', icon: Coffee, label: 'Café' },
  { id: 'sun', icon: Sun, label: 'Soleil' },
  { id: 'cloud', icon: Cloud, label: 'Nuage' },
  { id: 'glass', icon: GlassWater, label: 'Eau' },
  { id: 'food', icon: Utensils, label: 'Manger' },
  { id: 'bed', icon: Moon, label: 'Dormir' },
  { id: 'toilet', icon: Accessibility, label: 'Toilettes' },
  { id: 'pain', icon: Activity, label: 'Douleur' },
  { id: 'help', icon: HelpCircle, label: 'Aide' },
  { id: 'stop', icon: Hand, label: 'Stop' },
  { id: 'happy', icon: Smile, label: 'Content' },
  { id: 'sad', icon: Frown, label: 'Triste' },
  { id: 'go', icon: ArrowRightCircle, label: 'Aller' },
];

// Top needed words post-stroke (Basic)
export const BINARY_OPTIONS: QuickWord[] = [
  {
    id: 'yes',
    label: 'OUI',
    speakText: 'Oui',
    color: 'green',
    bgColor: 'bg-green-600',
    textColor: 'text-white',
    icon: ThumbsUp,
    iconName: 'thumbs-up',
    colSpan: 2 // Full width in grid
  },
  {
    id: 'no',
    label: 'NON',
    speakText: 'Non',
    color: 'red',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    icon: ThumbsDown,
    iconName: 'thumbs-down',
    colSpan: 2 // Full width in grid
  }
];

// Extended needs (The "Top 6" concept expanded slightly for a grid)
export const NEEDS_OPTIONS: QuickWord[] = [
  {
    id: 'water',
    label: 'BOIRE',
    speakText: 'Je veux boire de l\'eau',
    color: 'blue',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    icon: GlassWater,
    iconName: 'glass'
  },
  {
    id: 'toilet',
    label: 'TOILETTES',
    speakText: 'Je dois aller aux toilettes',
    color: 'cyan',
    bgColor: 'bg-cyan-600',
    textColor: 'text-white',
    icon: Accessibility,
    iconName: 'toilet'
  },
  {
    id: 'pain',
    label: 'DOULEUR',
    speakText: 'J\'ai mal',
    color: 'orange',
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    icon: Activity,
    iconName: 'pain'
  },
  {
    id: 'sleep',
    label: 'DORMIR',
    speakText: 'Je suis fatigué, je veux dormir',
    color: 'indigo',
    bgColor: 'bg-indigo-600',
    textColor: 'text-white',
    icon: Moon,
    iconName: 'bed'
  },
  {
    id: 'eat',
    label: 'MANGER',
    speakText: 'J\'ai faim',
    color: 'emerald',
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    icon: Utensils,
    iconName: 'food'
  },
  {
    id: 'help',
    label: 'AIDE',
    speakText: 'Aidez-moi s\'il vous plaît',
    color: 'yellow',
    bgColor: 'bg-yellow-600',
    textColor: 'text-black', // Contrast fix
    icon: HelpCircle,
    iconName: 'help'
  }
];

// Presets for Admin Library (Drag and Drop)
export const PRESET_TILES = [
  { label: 'OUI', speak: 'Oui', iconName: 'thumbs-up', color: 'green', bg: 'bg-green-600', text: 'text-white' },
  { label: 'NON', speak: 'Non', iconName: 'thumbs-down', color: 'red', bg: 'bg-red-600', text: 'text-white' },
  { label: 'STOP', speak: 'Stop', iconName: 'stop', color: 'red', bg: 'bg-red-600', text: 'text-white' },
  { label: 'BOIRE', speak: 'Je veux boire', iconName: 'glass', color: 'blue', bg: 'bg-blue-600', text: 'text-white' },
  { label: 'MANGER', speak: 'Je veux manger', iconName: 'food', color: 'emerald', bg: 'bg-emerald-600', text: 'text-white' },
  { label: 'TOILETTES', speak: 'Toilettes', iconName: 'toilet', color: 'cyan', bg: 'bg-cyan-600', text: 'text-white' },
  { label: 'DOULEUR', speak: 'J\'ai mal', iconName: 'pain', color: 'orange', bg: 'bg-orange-600', text: 'text-white' },
  { label: 'DORMIR', speak: 'Je veux dormir', iconName: 'bed', color: 'indigo', bg: 'bg-indigo-600', text: 'text-white' },
  { label: 'AIDE', speak: 'Aidez-moi', iconName: 'help', color: 'yellow', bg: 'bg-yellow-600', text: 'text-black' },
  { label: 'MERCI', speak: 'Merci', iconName: 'happy', color: 'yellow', bg: 'bg-yellow-500', text: 'text-black' },
  { label: 'BONJOUR', speak: 'Bonjour', iconName: 'hand', color: 'slate', bg: 'bg-slate-500', text: 'text-white' },
  { label: 'MAISON', speak: 'Je veux rentrer', iconName: 'home', color: 'purple', bg: 'bg-purple-600', text: 'text-white' },
];