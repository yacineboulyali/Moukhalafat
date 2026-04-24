import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Map as MapIcon, User, Settings, Award, Compass, Zap } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { totalXP, currentCity, playerName, playerLevel, fetchProfile } = useGameStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-main)', minHeight: '100%' }}>
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '52px', 
            height: '52px', 
            borderRadius: '18px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
          }}>
            <User size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{playerName}</h3>
            <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)', fontWeight: '600' }}>Niveau {playerLevel}</span>
          </div>
        </div>
        <div style={{ 
          padding: '10px 16px', 
          background: 'var(--surface)', 
          borderRadius: '16px', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Zap size={16} color="var(--gold)" fill="var(--gold)" />
          <span style={{ fontWeight: '800', color: 'var(--gold)' }}>{totalXP}</span>
        </div>
      </div>

      {/* Main Exploration Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/map')}
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.2), var(--bg-main)), url(https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=400&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '220px',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', padding: '6px 12px', borderRadius: '10px', alignSelf: 'flex-start', marginBottom: '12px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Compass size={14} /> Exploration Active
        </div>
        <h2 style={{ margin: 0, fontSize: '28px', textTransform: 'capitalize' }}>{currentCity}</h2>
        <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Continue ton voyage dans le Royaume</p>
      </motion.div>

      {/* Grid Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ActionTile icon={<MapIcon size={24} />} label="Carte" color="var(--primary-light)" onClick={() => navigate('/map')} />
        <ActionTile icon={<Award size={24} />} label="Badges" color="var(--gold)" onClick={() => navigate('/badges')} />
        <ActionTile icon={<Trophy size={24} />} label="Classement" color="var(--accent)" onClick={() => navigate('/leaderboard')} />
        <ActionTile icon={<Settings size={24} />} label="Réglages" color="var(--on-surface-variant)" />
      </div>

      {/* Progress Section */}
      <div className="glass" style={{ 
        padding: '24px', 
        borderRadius: '28px', 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0 }}>Objectif du Jour</h4>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-light)' }}>60%</span>
        </div>
        <div style={{ height: '10px', background: 'var(--surface-variant)', borderRadius: '5px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            style={{ height: '100%', background: 'linear-gradient(to right, var(--primary), var(--primary-light))' }} 
          />
        </div>
        <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', margin: '16px 0 0 0', lineHeight: '1.5' }}>
          Complète 2 missions pour débloquer le badge <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>"Explorateur"</span>.
        </p>
      </div>
    </div>
  );
};

const ActionTile = ({ icon, label, color, onClick }: any) => (
  <motion.div
    whileHover={{ y: -4, backgroundColor: 'var(--surface-variant)' }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    style={{
      background: 'var(--surface)',
      padding: '24px',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      border: '1px solid var(--border)',
      transition: 'background-color 0.2s'
    }}
  >
    <div style={{ color }}>{icon}</div>
    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--on-surface)' }}>{label}</span>
  </motion.div>
);
