export const AVATARS = {
  boy: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatars/avatar_boy.png?v=1775991607498' },
  girl: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatars/avatar_girl.png?v=1775991607498' },
  explorer: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatars/avatar_explorer.png?v=1775991607498' },
  mentor: { uri: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatars/avatar_mentor.png?v=1775991607498' },
};

export const getAvatarById = (id: number | string) => {
  const mapping: Record<string, any> = {
    '1': AVATARS.boy,
    '2': AVATARS.girl,
    '3': AVATARS.explorer,
    '4': AVATARS.mentor,
    'boy': AVATARS.boy,
    'girl': AVATARS.girl,
    'explorer': AVATARS.explorer,
    'mentor': AVATARS.mentor,
  };
  return mapping[String(id)] || AVATARS.boy;
};
