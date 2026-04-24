import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, Share2, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const Results = () => {
  const navigate = useNavigate();
  // const { totalXP } = useGameStore();

  return (
    <div style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10 }}
        >
          <Trophy size={100} color="var(--gold)" style={{ filter: 'drop-shadow(0 10px 20px rgba(212, 175, 55, 0.3))' }} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '32px', fontWeight: '800', marginTop: '24px', color: 'var(--primary)' }}
        >
          Mission Réussie !
        </motion.h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '40px' }}>
        <ResultCard label="XP Gagnés" value="+500" icon={<Star color="var(--gold)" fill="var(--gold)" />} />
        <ResultCard label="Précision" value="100%" icon={<Trophy color="var(--primary-light)" />} />
      </div>

      <div style={{ marginTop: '32px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}>
        <h4 style={{ margin: '0 0 16px 0' }}>Compétences Développées</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkillProgress label="Travail d'Équipe" progress={80} />
          <SkillProgress label="Communication" progress={65} />
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/map')}
          style={primaryButtonStyle}
        >
          Continuer l'Aventure <ArrowRight size={20} />
        </motion.button>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={secondaryButtonStyle}><RotateCcw size={18} /> Rejouer</button>
          <button style={secondaryButtonStyle}><Share2 size={18} /> Partager</button>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, icon }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'white',
      padding: '20px',
      borderRadius: '24px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    {icon}
    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</span>
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</span>
  </motion.div>
);

const SkillProgress = ({ label, progress }: any) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
      <span style={{ fontWeight: '600' }}>{label}</span>
      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>+{progress}%</span>
    </div>
    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ height: '100%', background: 'var(--primary)' }}
      />
    </div>
  </div>
);

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: 'var(--primary)',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 4px 0 #1a4030',
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px',
  background: 'white',
  border: '2px solid #eee',
  borderRadius: '16px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};
