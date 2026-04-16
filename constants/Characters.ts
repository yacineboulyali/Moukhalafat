import { THEME } from './theme';
import { AVATARS } from './Avatars';

export interface Character {
  id: string;
  name: string;
  arabicName: string;
  role: string;
  power: string;
  powerDescription: string;
  image: any;
  color: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'hassan',
    name: 'Hassan',
    arabicName: 'حسن',
    role: 'Le Patriarche / Expert Artisan',
    power: 'Sagesse Ancestrale',
    powerDescription: 'Révèle instantanément la meilleure option lors des dilemmes liés à l\'artisanat.',
    image: AVATARS.mentor,
    color: '#1A3D2E'
  },
  {
    id: 'fatima',
    name: 'Fatima',
    arabicName: 'فاطمة',
    role: 'La Négociatrice',
    power: 'Charme Méditerranéen',
    powerDescription: 'Réduit le coût des ressources et augmente les gains de confiance lors des négociations.',
    image: AVATARS.girl,
    color: '#D4AF37'
  },
  {
    id: 'youssef',
    name: 'Youssef',
    arabicName: 'يوسف',
    role: 'Le Stratège Digital',
    power: 'Analyse Flash',
    powerDescription: 'Double le temps disponible lors des mini-jeux techniques ou digitaux.',
    image: AVATARS.boy,
    color: '#ffab69'
  },
  {
    id: 'nadia',
    name: 'Nadia',
    arabicName: 'نادية',
    role: 'L\'Ambassadrice Culturelle',
    power: 'Réseau Royal',
    powerDescription: 'Débloque des indices exclusifs sur les traditions locales de chaque ville.',
    image: AVATARS.explorer, 
    color: '#2D6B5A'
  }
];
