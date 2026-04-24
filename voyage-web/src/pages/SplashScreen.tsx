import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Map as MapIcon, Star } from 'lucide-react';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/welcome'), 500);
          return 100;
        }
        return Math.min(oldProgress + 2, 100);
      });
    }, 40);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={containerStyle}>
      {/* Background Decor */}
      <div style={decorStyle} />

      <div style={contentStyle}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          style={logoContainerStyle}
        >
          {/* Animated Dashed Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={outerRingStyle}
          />
          
          <div style={mainCircleStyle}>
            <MapIcon size={80} color="var(--gold)" style={{ opacity: 0.05, position: 'absolute' }} />
            <Compass size={60} color="var(--primary)" />
          </div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={floatingStarStyle}
          >
            <Star size={16} color="white" fill="white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={textContainerStyle}
        >
          <h1 style={titleStyle}>Le Voyage des Compétences</h1>
          <h2 style={arabicTitleStyle}>رحلة المهارات</h2>
          <div style={dividerStyle} />
          <p style={descriptionStyle}>Développe tes compétences à travers le Maroc</p>
        </motion.div>
      </div>

      <div style={progressContainerStyle}>
        <div style={progressTrackStyle}>
          <motion.div
            style={{ ...progressFillStyle, width: `${progress}%` }}
          />
        </div>
        <p style={progressTextStyle}>
          {progress === 100 ? "VOYAGE PRÊT !" : `CHARGEMENT DES RESSOURCES... ${progress}%`}
        </p>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#FDFBF7', // Mobile light background
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
};

const decorStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '8px',
  background: 'var(--primary)',
  opacity: 0.1
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10
};

const logoContainerStyle: React.CSSProperties = {
  width: '160px',
  height: '160px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '40px',
  position: 'relative'
};

const outerRingStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '80px',
  border: '1.5px dashed rgba(212, 175, 55, 0.4)'
};

const mainCircleStyle: React.CSSProperties = {
  width: '130px',
  height: '130px',
  borderRadius: '65px',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  position: 'relative'
};

const floatingStarStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: 'var(--gold)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const textContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0 32px'
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: '900',
  color: 'var(--primary)',
  margin: '0 0 4px 0'
};

const arabicTitleStyle: React.CSSProperties = {
  fontFamily: '"Noto Sans Arabic", sans-serif',
  fontSize: '32px',
  color: 'var(--gold)',
  fontWeight: '700',
  margin: '0 0 16px 0'
};

const dividerStyle: React.CSSProperties = {
  width: '48px',
  height: '4px',
  background: 'var(--gold)',
  borderRadius: '2px',
  margin: '0 auto 16px auto'
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--on-surface-variant)',
  fontWeight: '500',
  letterSpacing: '0.5px'
};

const progressContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '64px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const progressTrackStyle: React.CSSProperties = {
  width: '100%',
  height: '4px',
  background: 'rgba(0,0,0,0.05)',
  borderRadius: '2px',
  overflow: 'hidden',
  marginBottom: '12px'
};

const progressFillStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--primary)'
};

const progressTextStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  color: 'var(--on-surface-variant)',
  opacity: 0.6,
  margin: 0
};
