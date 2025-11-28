import { Check, X, GlassWater, Accessibility, Activity, Moon, Utensils, UtensilsCrossed, ThumbsUp, ThumbsDown, HelpCircle, Tv, Home, Phone, Heart, Star, Music, User, Car, Plane, Book, Gamepad2, Coffee, Sun, Cloud, Hand, Smile, Frown, LogOut, ArrowRightCircle, Clapperboard, Candy, Cookie, IceCream, CakeSlice } from 'lucide-react';
import { QuickWord } from './types';

// Available icons for the picker
export const AVAILABLE_ICONS = [
  { id: 'thumbs-up', icon: ThumbsUp, label: 'Pouce haut' },
  { id: 'thumbs-down', icon: ThumbsDown, label: 'Pouce bas' },
  { id: 'home', icon: Home, label: 'Maison' },
  { id: 'user', icon: User, label: 'Personne' },
  { id: 'heart', icon: Heart, label: 'Coeur' },
  { id: 'star', icon: Star, label: 'Etoile' },
  { id: 'tv', icon: Tv, label: 'TV' },
  { id: 'cinema', icon: Clapperboard, label: 'Cinema' },
  { id: 'phone', icon: Phone, label: 'Telephone' },
  { id: 'music', icon: Music, label: 'Musique' },
  { id: 'book', icon: Book, label: 'Livre' },
  { id: 'game', icon: Gamepad2, label: 'Jeu' },
  { id: 'car', icon: Car, label: 'Voiture' },
  { id: 'restaurant', icon: UtensilsCrossed || Utensils, label: 'Restaurant' },
  { id: 'coffee', icon: Coffee, label: 'Cafe' },
  { id: 'candy', icon: Candy, label: 'Bonbon' },
  { id: 'chocolate', icon: Cookie, label: 'Chocolat' },
  { id: 'cake', icon: CakeSlice, label: 'Gateau' },
  { id: 'ice-cream', icon: IceCream, label: 'Glace' },
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

// Page 1: Besoins vitaux (Basic vital needs)
// Code couleur: Bleu = besoins physiques, Rouge = danger, Jaune = information
export const NEEDS_OPTIONS: QuickWord[] = [
  {
    id: 'water',
    label: 'BOIRE',
    speakText: 'Je veux boire de l\'eau',
    color: 'blue',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    icon: GlassWater,
    iconName: 'glass',
    colSpan: 1
  },
  {
    id: 'pain',
    label: 'DOULEUR',
    speakText: 'J\'ai mal',
    color: 'red',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    icon: Activity,
    iconName: 'pain',
    colSpan: 1
  },
  {
    id: 'toilet',
    label: 'TOILETTES',
    speakText: 'Je dois aller aux toilettes',
    color: 'blue',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    icon: Accessibility,
    iconName: 'toilet',
    colSpan: 1
  },
  {
    id: 'help',
    label: 'AIDE',
    speakText: 'Aidez-moi s\'il vous plaît',
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: HelpCircle,
    iconName: 'help',
    colSpan: 1
  }
];

// Page 2: Émotions / Relationnel (Emotions and relationships)
// Code couleur: Rose/Rouge = émotions, Vert = positif
export const EMOTIONS_OPTIONS: QuickWord[] = [
  {
    id: 'sad',
    label: 'TRISTE',
    speakText: 'Je suis triste',
    color: 'rose',
    bgColor: 'bg-rose-600',
    textColor: 'text-white',
    icon: Frown,
    iconName: 'sad',
    colSpan: 1
  },
  {
    id: 'happy',
    label: 'CONTENT',
    speakText: 'Je suis content',
    color: 'green',
    bgColor: 'bg-green-600',
    textColor: 'text-white',
    icon: Smile,
    iconName: 'happy',
    colSpan: 1
  },
  {
    id: 'love',
    label: 'JE T\'AIME',
    speakText: 'Je t\'aime',
    color: 'pink',
    bgColor: 'bg-pink-600',
    textColor: 'text-white',
    icon: Heart,
    iconName: 'heart',
    colSpan: 1
  },
  {
    id: 'tired',
    label: 'FATIGUÉ',
    speakText: 'Je suis fatigué',
    color: 'indigo',
    bgColor: 'bg-indigo-600',
    textColor: 'text-white',
    icon: Moon,
    iconName: 'bed',
    colSpan: 1
  }
];

// Legacy export for backwards compatibility (no longer used)
export const BINARY_OPTIONS: QuickWord[] = [];

// Presets for Admin Library (Drag and Drop)
// Code couleur harmonisé:
// - Vert = validation / positif
// - Rouge = refus / danger
// - Bleu = besoins physiques
// - Jaune = information
// - Rose/Rouge = émotions
export const PRESET_TILES = [
  // Positif
  { label: 'OUI', speak: 'Oui', iconName: 'thumbs-up', color: 'green', bg: 'bg-green-600', text: 'text-white', category: 'Positif' },
  { label: 'CONTENT', speak: 'Je suis content', iconName: 'happy', color: 'green', bg: 'bg-green-600', text: 'text-white', category: 'Positif' },
  { label: 'MERCI', speak: 'Merci', iconName: 'happy', color: 'green', bg: 'bg-green-600', text: 'text-white', category: 'Positif' },

  // Negatif / Danger
  { label: 'NON', speak: 'Non', iconName: 'thumbs-down', color: 'red', bg: 'bg-red-600', text: 'text-white', category: 'Danger' },
  { label: 'STOP', speak: 'Stop', iconName: 'stop', color: 'red', bg: 'bg-red-600', text: 'text-white', category: 'Danger' },
  { label: 'DOULEUR', speak: "J'ai mal", iconName: 'pain', color: 'red', bg: 'bg-red-600', text: 'text-white', category: 'Danger' },

  // Besoins physiques
  { label: 'BOIRE', speak: 'Je veux boire', iconName: 'glass', color: 'blue', bg: 'bg-blue-600', text: 'text-white', category: 'Besoins' },
  { label: 'MANGER', speak: 'Je veux manger', iconName: 'food', color: 'blue', bg: 'bg-blue-600', text: 'text-white', category: 'Besoins' },
  { label: 'TOILETTES', speak: 'Toilettes', iconName: 'toilet', color: 'blue', bg: 'bg-blue-600', text: 'text-white', category: 'Besoins' },

  // Information
  { label: 'AIDE', speak: 'Aidez-moi', iconName: 'help', color: 'yellow', bg: 'bg-yellow-500', text: 'text-black', category: 'Information' },
  { label: 'BONJOUR', speak: 'Bonjour', iconName: 'hand', color: 'yellow', bg: 'bg-yellow-500', text: 'text-black', category: 'Information' },

  // Emotions
  { label: 'TRISTE', speak: 'Je suis triste', iconName: 'sad', color: 'rose', bg: 'bg-rose-600', text: 'text-white', category: 'Emotions' },
  { label: "JE T'AIME", speak: "Je t'aime", iconName: 'heart', color: 'pink', bg: 'bg-pink-600', text: 'text-white', category: 'Emotions' },
  { label: 'FATIGUE', speak: 'Je suis fatigue', iconName: 'bed', color: 'indigo', bg: 'bg-indigo-600', text: 'text-white', category: 'Emotions' },

  // Vie courante
  { label: 'RESTAURANT', speak: 'Aller au restaurant', iconName: 'restaurant', color: 'orange', bg: 'bg-orange-600', text: 'text-white', category: 'Vie courante' },
  { label: 'CINEMA', speak: 'Aller au cinema', iconName: 'cinema', color: 'purple', bg: 'bg-purple-600', text: 'text-white', category: 'Vie courante' },
  { label: 'TV', speak: 'Regarder la television', iconName: 'tv', color: 'blue', bg: 'bg-blue-700', text: 'text-white', category: 'Vie courante' },
  { label: 'LIVRE', speak: 'Lire un livre', iconName: 'book', color: 'slate', bg: 'bg-slate-700', text: 'text-white', category: 'Vie courante' },

  // Gourmandises
  { label: 'BONBON', speak: 'Je veux un bonbon', iconName: 'candy', color: 'pink', bg: 'bg-pink-600', text: 'text-white', category: 'Gourmandises' },
  { label: 'CHOCOLAT', speak: 'Je veux du chocolat', iconName: 'chocolate', color: 'amber', bg: 'bg-amber-600', text: 'text-white', category: 'Gourmandises' },
  { label: 'GATEAU', speak: 'Je veux du gateau', iconName: 'cake', color: 'yellow', bg: 'bg-yellow-500', text: 'text-black', category: 'Gourmandises' },
  { label: 'GLACE', speak: 'Je veux une glace', iconName: 'ice-cream', color: 'cyan', bg: 'bg-cyan-500', text: 'text-black', category: 'Gourmandises' },
];
