// Profile.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Award, Shield, Settings } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '24px', background: 'var(--bg-main)', height: '100%' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={24} />
      </button>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50px', background: 'var(--primary)', margin: '0 auto 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <User size={50} />
        </div>
        <h2 style={{ margin: 0 }}>Yacine Boulyali</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Apprenti Leader</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={menuItemStyle} onClick={() => navigate('/badges')}><Award size={20} /> Mes Badges</div>
        <div style={menuItemStyle}><Shield size={20} /> Certifications</div>
        <div style={menuItemStyle}><Settings size={20} /> Paramètres</div>
      </div>
    </div>
  );
};

// Badges.tsx
export const Badges = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '24px', background: 'var(--bg-main)', height: '100%' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={24} />
      </button>
      <h2>Collection de Badges</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ aspectRatio: '1', background: 'white', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', boxShadow: 'var(--shadow-sm)' }}>
            🏅
          </div>
        ))}
      </div>
    </div>
  );
};

// Leaderboard.tsx
export const Leaderboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '24px', background: 'var(--bg-main)', height: '100%' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={24} />
      </button>
      <h2>Classement Général</h2>
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <span>#{i} Joueur {i}</span>
            <span style={{ fontWeight: 'bold' }}>{1000 - i * 100} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  background: 'white',
  padding: '16px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontWeight: '600',
  boxShadow: 'var(--shadow-sm)',
  cursor: 'pointer'
};
