export interface Badge {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  image?: any;
  remoteImage?: string;
  type: 'jewel' | 'skill' | 'quest';
  city?: string;
  unlocked?: boolean;
}

const STORAGE_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges';

export const BADGES: Badge[] = [
  // RABAT
  {
    id: 'mdama_rabat',
    name: 'Mdama',
    arabicName: 'مدامة',
    description: 'Ceinture traditionnelle symbole d\'élégance et de statut.',
    rarity: 'rare',
    icon: 'military-tech',
    image: require('../assets/images/badge_mdama.png'),
    remoteImage: `${STORAGE_URL}/Mdama.png`,
    type: 'jewel',
    city: 'rabat',
    unlocked: true
  },
  {
    id: 'sertla_rabat',
    name: 'Sertla',
    arabicName: 'سرتلة',
    description: 'Bijou de tête royal symbolisant la sagesse administrative.',
    rarity: 'epic',
    icon: 'workspace-premium',
    image: require('../assets/images/badge_sertla.png'),
    remoteImage: `${STORAGE_URL}/Sertla.png`,
    type: 'jewel',
    city: 'rabat',
    unlocked: true
  },
  {
    id: 'khmissa_rabat',
    name: 'Khmissa',
    arabicName: 'خميسة',
    description: 'Main de Fatima protectrice.',
    rarity: 'common',
    icon: 'pan-tool',
    remoteImage: `${STORAGE_URL}/Khmissa.png`,
    type: 'jewel',
    city: 'rabat',
    unlocked: true
  },
  
  // CHEFCHAOUEN
  {
    id: 'chebbka',
    name: 'Chebbka',
    arabicName: 'شبكة',
    description: 'Dentelle bleue fine symbolisant la communication fluide.',
    rarity: 'common',
    icon: 'grid-view',
    remoteImage: `${STORAGE_URL}/Chebbka.png`,
    type: 'jewel',
    city: 'chefchaouen',
    unlocked: true
  },
  {
    id: 'fnous',
    name: 'Fnous',
    arabicName: 'فنوس',
    description: 'Lanterne guidant à travers le labyrinthe bleu.',
    rarity: 'rare',
    icon: 'lightbulb',
    remoteImage: `${STORAGE_URL}/Fnous.png`,
    type: 'jewel',
    city: 'chefchaouen',
    unlocked: true
  },
  {
    id: 'tazrabt_chef',
    name: 'Tazrabt',
    arabicName: 'تزربت',
    description: 'Tissage artisanal bleu azur.',
    rarity: 'epic',
    icon: 'texture',
    remoteImage: `${STORAGE_URL}/Tazrabt.png`,
    type: 'jewel',
    city: 'chefchaouen',
    unlocked: true
  },

  // FÈS
  {
    id: 'khalkhal_fes',
    name: 'Khalkhal',
    arabicName: 'خلخال',
    description: 'Bracelet de cheville traditionnel de Fès.',
    rarity: 'rare',
    icon: 'radio-button-unchecked',
    remoteImage: `${STORAGE_URL}/khalkhal.png`,
    type: 'jewel',
    city: 'fes',
    unlocked: true
  },
  {
    id: 'tifinagh',
    name: 'Tifinagh',
    arabicName: 'تيفيناغ',
    description: 'Symbole du savoir ancestral et de l\'écriture.',
    rarity: 'legendary',
    icon: 'spellcheck',
    remoteImage: `${STORAGE_URL}/Tifinagh.png`,
    type: 'jewel',
    city: 'fes',
    unlocked: true
  },
  {
    id: 'tasfift',
    name: 'Tasfift',
    arabicName: 'تسفيفت',
    description: 'Ruban brodé de fils d\'or.',
    rarity: 'epic',
    icon: 'linear-scale',
    remoteImage: `${STORAGE_URL}/Tasfift.png`,
    type: 'jewel',
    city: 'fes',
    unlocked: true
  },

  // MARRAKECH
  {
    id: 'tizerzai',
    name: 'Tizerzai',
    arabicName: 'تيزرزاي',
    description: 'Fibule berbère symbolisant l\'union et la force.',
    rarity: 'rare',
    icon: 'link',
    remoteImage: `${STORAGE_URL}/Tizerzai.png`,
    type: 'jewel',
    city: 'marrakech',
    unlocked: true
  },
  {
    id: 'abzim',
    name: 'Abzim',
    arabicName: 'أبزيم',
    description: 'Boucle de ceinture ciselée de la ville ocre.',
    rarity: 'rare',
    icon: 'adjust',
    remoteImage: `${STORAGE_URL}/Abzim.png`,
    type: 'jewel',
    city: 'marrakech',
    unlocked: true
  },
  {
    id: 'ibzimen',
    name: 'Ibzimen',
    arabicName: 'إبزيمن',
    description: 'Paire de fibules traditionnelles.',
    rarity: 'epic',
    icon: 'join-full',
    remoteImage: `${STORAGE_URL}/Ibzimen.png`,
    type: 'jewel',
    city: 'marrakech',
    unlocked: true
  },

  // LAÂYOUNE
  {
    id: 'aghraf',
    name: 'Aghraf',
    arabicName: 'أغراف',
    description: 'Vase saharien traditionnel.',
    rarity: 'common',
    icon: 'local-drink',
    remoteImage: `${STORAGE_URL}/Aghraf.png`,
    type: 'jewel',
    city: 'laayoune',
    unlocked: true
  },
  {
    id: 'tazrabt_sahara',
    name: 'Tazrabt Sahara',
    arabicName: 'تزربت الصحراء',
    description: 'Tissage robuste du désert.',
    rarity: 'rare',
    icon: 'dashboard',
    remoteImage: `${STORAGE_URL}/Tazrabt%20Sahara.png`,
    type: 'jewel',
    city: 'laayoune',
    unlocked: true
  },
  {
    id: 'fnous_dhahab',
    name: 'Fnous n\'Dhaḥab',
    arabicName: 'فنوس الذهب',
    description: 'Lanterne dorée sacrée.',
    rarity: 'legendary',
    icon: 'auto-awesome',
    type: 'jewel',
    city: 'laayoune',
    unlocked: true
  },

  // DAKHLA
  {
    id: 'mdama_bahar',
    name: 'Mdama Baḥar',
    arabicName: 'مدامة البحر',
    description: 'Ceinture ornée de perles marines.',
    rarity: 'epic',
    icon: 'waves',
    remoteImage: `${STORAGE_URL}/Mdama%20bahar.png`,
    type: 'jewel',
    city: 'dakhla',
    unlocked: true
  },
  {
    id: 'khalkhal_mawj',
    name: 'Khalkhal Mawj',
    arabicName: 'خلخال موج',
    description: 'Anneau de vague de l\'Atlantique.',
    rarity: 'rare',
    icon: 'water',
    remoteImage: `${STORAGE_URL}/Khalkhal%20Mawj.png`,
    type: 'jewel',
    city: 'dakhla',
    unlocked: true
  },
  {
    id: 'sertla_atlantik',
    name: 'Sertla Atlantik',
    arabicName: 'سرتلة أتلانتيك',
    description: 'Couronne des côtes sahariennes.',
    rarity: 'legendary',
    icon: 'verified',
    remoteImage: `${STORAGE_URL}/Sertia%20Atlantik.png`,
    type: 'jewel',
    city: 'dakhla',
    unlocked: true
  },

  // TABRAAT
  {
    id: 'tabraat_final',
    name: 'Tabraat',
    arabicName: 'تبرات - الشارة العليا',
    description: 'Le Maître Artisan des Savoirs Traversants. La plus haute distinction du voyage.',
    rarity: 'legendary',
    icon: 'stars',
    remoteImage: `${STORAGE_URL}/Tabraat.png`,
    type: 'jewel',
    unlocked: true
  }
];
