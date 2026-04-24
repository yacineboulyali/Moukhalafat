import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Clock, Trophy } from 'lucide-react';

const CITY_DATA: any = {
  rabat: {
    name: 'Rabat',
    tagline: 'La Capitale Administrative',
    description: 'Explorez les institutions et apprenez les bases du travail d\'équipe et de la communication professionnelle.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=400&q=80',
    missions: [
      { id: 'R1', title: 'Premiers pas à Rabat', type: 'Fondamentaux', xp: 500, completed: false },
      { id: 'R2', title: 'Le Monde des Affaires', type: 'Gestion', xp: 600, completed: false },
    ]
  },
  casablanca: {
    name: 'Casablanca',
    tagline: 'La Métropole Économique',
    description: 'Plongez dans l\'effervescence de la capitale économique et testez votre réactivité et votre sens des affaires.',
    image: 'https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&w=400&q=80',
    missions: [
      { id: 'C1', title: 'Négociation au port', type: 'Commerce', xp: 700, completed: false },
    ]
  }
};

export const CityDetail = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const data = CITY_DATA[cityId || 'rabat'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Banner */}
      <div style={{ 
        height: '250px', 
        background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${data.image})`,
        backgroundSize: 'cover',
        position: 'relative',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={() => navigate('/map')}
          style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '32px' }}>{data.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0' }}>{data.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{data.description}</p>

        <h3 style={{ margin: 0 }}>Missions Disponibles</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.missions.map((mission: any) => (
            <motion.div
              key={mission.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/challenge/${mission.id}`)}
              style={{
                background: 'var(--surface)',
                padding: '16px',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  background: mission.completed ? 'var(--primary-light)' : 'var(--surface-variant)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: mission.completed ? 'white' : 'var(--text-secondary)'
                }}>
                  {mission.completed ? <CheckCircle size={24} /> : <Play size={20} />}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{mission.title}</h4>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> 15 min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trophy size={12} color="var(--gold)" /> {mission.xp} XP
                    </span>
                  </div>
                </div>
              </div>
              <ArrowLeft style={{ transform: 'rotate(180deg)', opacity: 0.3 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
