export interface Badge {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  type: 'jewel' | 'skill' | 'quest';
  city?: string;
}

export const BADGES: Badge[] = [
  {
    id: 'mniqqa',
    name: 'Mniqqa d\'Or',
    arabicName: 'منيقة ذهبية',
    description: 'Boucle d\'oreille traditionnelle symbole de l\'écoute active et de la communication.',
    rarity: 'legendary',
    icon: 'hearing',
    type: 'jewel',
    city: 'fes'
  },
  {
    id: 'tabraat',
    name: 'Tabraat d\'Argent',
    arabicName: 'تبرات فضية',
    description: 'Pendentif berbère récompensant la résilience et la force de caractère.',
    rarity: 'epic',
    icon: 'shield',
    type: 'jewel',
    city: 'marrakech'
  },
  {
    id: 'khmissa',
    name: 'Khmissa Protectrice',
    arabicName: 'خميسة واقية',
    description: 'Main de Fatima protégeant vos projets contre les imprévus techniques.',
    rarity: 'rare',
    icon: 'pan-tool',
    type: 'jewel'
  },
  {
    id: 'taj_skills',
    name: 'Taj des Compétences',
    arabicName: 'تاج المهارات',
    description: 'Couronne royale décernée pour la maîtrise de 5 compétences majeures.',
    rarity: 'legendary',
    icon: 'workspace-premium',
    type: 'jewel'
  },
  {
    id: 'sarout',
    name: 'Sarout l\'Mdina',
    arabicName: 'ساروت المدينة',
    description: 'La clé de la ville débloquée après une réussite parfaite à Casablanca.',
    rarity: 'common',
    icon: 'vpn-key',
    type: 'jewel',
    city: 'casablanca'
  }
];
