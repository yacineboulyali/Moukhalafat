import { THEME } from './theme';

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
    image: require('../assets/images/avatar-default.jpg'), // À remplacer par l'illustration finale
    color: '#1A3D2E'
  },
  {
    id: 'fatima',
    name: 'Fatima',
    arabicName: 'فاطمة',
    role: 'La Négociatrice',
    power: 'Charme Méditerranéen',
    powerDescription: 'Réduit le coût des ressources et augmente les gains de confiance lors des négociations.',
    image: require('../assets/images/fatima-character.jpg'),
    color: '#D4AF37'
  },
  {
    id: 'youssef',
    name: 'Youssef',
    arabicName: 'يوسف',
    role: 'Le Stratège Digital',
    power: 'Analyse Flash',
    powerDescription: 'Double le temps disponible lors des mini-jeux techniques ou digitaux.',
    image: require('../assets/images/avatar-stratege.jpg'),
    color: '#ffab69'
  },
  {
    id: 'nadia',
    name: 'Nadia',
    arabicName: 'نادية',
    role: 'L\'Ambassadrice Culturelle',
    power: 'Réseau Royal',
    powerDescription: 'Débloque des indices exclusifs sur les traditions locales de chaque ville.',
    image: require('../assets/images/avatar-mehdi.jpg'), 
    color: '#2D6B5A'
  }
];
