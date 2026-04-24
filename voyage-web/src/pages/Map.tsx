import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft, Lock, Trophy, Star } from 'lucide-react';

const CITIES = [
  { id: 'casablanca', name: 'Casablanca', x: '40%', y: '40%', unlocked: true, icon: '🏙️' },
  { id: 'rabat', name: 'Rabat', x: '45%', y: '30%', unlocked: true, icon: '🏛️' },
  { id: 'tanger', name: 'Tanger', x: '52%', y: '12%', unlocked: false, icon: '🚢' },
  { id: 'fes', name: 'Fès', x: '62%', y: '32%', unlocked: false, icon: '🕌' },
  { id: 'marrakech', name: 'Marrakech', x: '35%', y: '58%', unlocked: false, icon: '🌴' },
  { id: 'agadir', name: 'Agadir', x: '25%', y: '75%', unlocked: false, icon: '🏖️' },
];

export const Map = () => {
  const navigate = useNavigate();
  const { totalXP, currentCity, setCity } = useGameStore();

  return (
    <div style={{ height: '100%', position: 'relative', background: '#f0f9ff', overflow: 'hidden' }}>
      {/* HUD Header */}
      <div style={{ 
        position: 'absolute', 
        top: '60px', 
        left: '20px', 
        right: '20px',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          style={hudButtonStyle}
        >
          <ArrowLeft size={20} />
        </motion.button>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={hudInfoStyle}>
            <Star size={16} color="var(--gold)" fill="var(--gold)" />
            <span>Niveau 5</span>
          </div>
          <div style={hudInfoStyle}>
            <Trophy size={16} color="var(--gold)" />
            <span>{totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* Map Background (Styled SVG) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice">
          <path d="M 50,100 Q 150,50 250,100 T 350,200" fill="none" stroke="var(--primary)" strokeWidth="100" opacity="0.1" />
          <path d="M 0,400 Q 100,350 200,400 T 400,500" fill="none" stroke="var(--primary)" strokeWidth="80" opacity="0.1" />
        </svg>
      </div>

      {/* City Nodes */}
      {CITIES.map((city) => (
        <motion.div
          key={city.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            position: 'absolute',
            left: city.x,
            top: city.y,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (city.unlocked) {
                setCity(city.id as any);
                navigate(`/city/${city.id}`);
              }
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '22px',
              background: city.unlocked ? (currentCity === city.id ? 'var(--primary)' : 'white') : '#cbd5e1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: city.unlocked ? '0 10px 20px rgba(45, 106, 79, 0.2)' : 'none',
              cursor: city.unlocked ? 'pointer' : 'not-allowed',
              border: '4px solid white',
              fontSize: '28px',
              position: 'relative'
            }}
          >
            {city.unlocked ? city.icon : <Lock size={20} color="#64748b" />}
            {city.unlocked && currentCity === city.id && (
              <motion.div
                layoutId="active-indicator"
                style={{
                  position: 'absolute',
                  top: -12,
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                ICI
              </motion.div>
            )}
          </motion.div>
          <span style={{ 
            background: city.unlocked ? 'white' : 'rgba(255,255,255,0.5)', 
            color: city.unlocked ? 'var(--text-primary)' : '#94a3b8',
            padding: '4px 12px', 
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {city.name}
          </span>
        </motion.div>
      ))}

      {/* Moroccan Compass/Decoration */}
      <div style={{ position: 'absolute', bottom: '120px', right: '20px', opacity: 0.2, transform: 'rotate(15deg)' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="2" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="var(--primary)" strokeWidth="1" />
        </svg>
      </div>

      {/* Quick Navigation Footer */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '20px',
        right: '20px',
        display: 'flex',
        gap: '12px'
      }}>
        <button onClick={() => navigate('/home')} style={footerButtonStyle}>🏠 Accueil</button>
        <button onClick={() => navigate('/profile')} style={footerButtonStyle}>👤 Profil</button>
      </div>
    </div>
  );
};

const hudButtonStyle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  background: 'white',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  cursor: 'pointer'
};

const hudInfoStyle: React.CSSProperties = {
  background: 'white',
  padding: '8px 14px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontSize: '14px',
  fontWeight: 'bold'
};

const footerButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '16px',
  background: 'white',
  border: 'none',
  borderRadius: '18px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  cursor: 'pointer',
  fontSize: '14px'
};
