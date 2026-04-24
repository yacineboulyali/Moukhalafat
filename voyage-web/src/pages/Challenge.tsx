import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const Challenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { addXP } = useGameStore();

  const [step, setStep] = useState<'intro' | 'dialogue' | 'exercise' | 'results'>('intro');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [missionData, setMissionData] = useState<any>(null);

  useEffect(() => {
    import(`../data/missions/R1.json`).then(data => {
      setMissionData(data.mission);
    }).catch(() => navigate('/map'));
  }, [challengeId, navigate]);

  if (!missionData) return <div style={{ background: 'var(--bg-main)', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</div>;

  const handleNext = () => {
    if (step === 'intro') setStep('dialogue');
    else if (step === 'dialogue') setStep('exercise');
    else if (step === 'exercise') {
      const exercises = missionData.profils[0].exercices_profil;
      if (currentExIndex < exercises.length - 1) {
        setCurrentExIndex(prev => prev + 1);
      } else {
        setStep('results');
        addXP(score);
      }
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', color: 'var(--on-surface-variant)' }}><X size={24} /></button>
        <div style={{ flex: 1, height: '8px', background: 'var(--surface-variant)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step === 'results' ? 100 : (currentExIndex + 1) / 3 * 100)}%` }}
            style={{ height: '100%', background: 'var(--primary-light)' }} 
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff4b4b', fontWeight: 'bold' }}>
          <Heart size={18} fill="#ff4b4b" />
          <span>3</span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={contentStyle}>
              <span style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{missionData.acte}</span>
              <h2 style={{ fontSize: '28px', marginTop: '8px' }}>{missionData.titre}</h2>
              <div style={cardStyle}>
                <p style={{ lineHeight: '1.7', color: 'var(--on-surface-variant)' }}>{missionData.narration_intro.texte}</p>
              </div>
            </motion.div>
          )}

          {step === 'dialogue' && (
            <motion.div key="dialogue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ fontSize: '40px', background: 'var(--surface-variant)', width: '70px', height: '70px', borderRadius: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border)' }}>
                  {missionData.profils[0].emoji}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{missionData.profils[0].nom}</h3>
                  <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{missionData.profils[0].profession}</span>
                </div>
              </div>
              <div style={{ position: 'relative', padding: '24px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                <p style={{ fontSize: '17px', lineHeight: '1.6', margin: 0 }}>"Bienvenue à l'OFPPT ! Le travail en équipe est le fondement de toute réussite professionnelle au Maroc."</p>
                <div style={{ position: 'absolute', left: '20px', top: '-10px', width: '20px', height: '20px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)', transform: 'rotate(45deg)' }} />
              </div>
            </motion.div>
          )}

          {step === 'exercise' && (
            <ExerciseView 
              exercise={missionData.profils[0].exercices_profil[currentExIndex]} 
              onAnswer={(correct: boolean) => {
                if (correct) setScore(s => s + 100);
                setTimeout(handleNext, 1200);
              }}
            />
          )}
          
          {/* Results screen remains similar but with new tokens */}
        </AnimatePresence>
      </div>

      {(step === 'intro' || step === 'dialogue') && (
        <div style={{ padding: '24px' }}>
          <button onClick={handleNext} style={primaryButtonStyle}>
            Continuer <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const ExerciseView = ({ exercise, onAnswer }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentStyle}>
      <h3 style={{ fontSize: '20px', lineHeight: '1.5', marginBottom: '32px' }}>{exercise.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {exercise.options.map((opt: any) => (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => !selected && (setSelected(opt.id), onAnswer(opt.correct))}
            style={{
              padding: '20px',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: selected === opt.id ? (opt.correct ? '#10b981' : '#ef4444') : 'var(--border)',
              background: selected === opt.id ? (opt.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)',
              color: 'var(--on-surface)',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {opt.texte}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const contentStyle: React.CSSProperties = { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' };
const cardStyle: React.CSSProperties = { background: 'var(--surface)', padding: '24px', borderRadius: '28px', border: '1px solid var(--border)', marginTop: '20px' };
const primaryButtonStyle: React.CSSProperties = {
  width: '100%', padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '22px', fontSize: '17px', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(6, 78, 59, 0.3)', cursor: 'pointer'
};
