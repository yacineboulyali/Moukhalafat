/**
 * Configuration des villes et destinations
 */
import { CityData } from '../types';

export const CITIES: CityData[] = [
  {
    id: 'casablanca',
    name: 'Casablanca',
    arabicName: 'الدار البيضاء',
    description: 'La capitale économique et le point de départ de votre aventure digitale.',
    coordinates: { latitude: 33.5731, longitude: -7.5898 },
    image_url: '../assets/images/cities/casablanca.png',
    isUnlocked: true,
    order: 1
  },
  {
    id: 'rabat',
    name: 'Rabat',
    arabicName: 'الرباط',
    description: 'La capitale administrative, sanctuaire de la diplomatie et du leadership.',
    coordinates: { latitude: 34.0209, longitude: -6.8417 },
    image_url: '../assets/images/cities/rabat.png',
    isUnlocked: false,
    order: 2
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    arabicName: 'مراكش',
    description: 'La ville ocre, centre de créativité et de négociation commerciale.',
    coordinates: { latitude: 31.6295, longitude: -7.9811 },
    image_url: '../assets/images/cities/marrakech.png',
    isUnlocked: false,
    order: 3
  },
  {
    id: 'fes',
    name: 'Fès',
    arabicName: 'فاس',
    description: 'Le coeur spirituel et intellectuel, maître du savoir-être antique.',
    coordinates: { latitude: 34.0333, longitude: -5.0000 },
    image_url: '../assets/images/cities/fes.png',
    isUnlocked: false,
    order: 4
  },
  {
    id: 'tanger',
    name: 'Tanger',
    arabicName: 'طنجة',
    description: 'La porte du nord, point de convergence des cultures et de l\'innovation.',
    coordinates: { latitude: 35.7595, longitude: -5.8340 },
    image_url: '../assets/images/cities/tanger.png',
    isUnlocked: false,
    order: 5
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    arabicName: 'شفشاون',
    description: 'La perle bleue, lieu de sérénité et de maîtrise de l\'intelligence émotionnelle.',
    coordinates: { latitude: 35.1740, longitude: -5.2632 },
    image_url: '../assets/images/cities/chefchaouen.png',
    isUnlocked: false,
    order: 6
  }
];
