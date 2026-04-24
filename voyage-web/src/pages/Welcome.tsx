import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: '100%', 
      padding: '40px 24px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      background: 'var(--bg-main)'
    }}>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ fontSize: '80px', marginBottom: '24px' }}
        >
          🎓
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}
        >
          Bienvenue, Voyageur !
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.6' }}
        >
          Prêt à explorer le Maroc et à forger tes compétences professionnelles ?
        </motion.p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/auth/login')}
          style={{
            padding: '18px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 6px 0 #059669',
            cursor: 'pointer'
          }}
        >
          C'est parti !
        </motion.button>
        <button 
          onClick={() => navigate('/auth/login')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          J'ai déjà un compte
        </button>
      </div>
    </div>
  );
};
