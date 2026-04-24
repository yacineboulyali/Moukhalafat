import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler une connexion
    navigate('/home');
  };

  return (
    <div style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 0' }}
      >
        ← Retour
      </button>

      <div style={{ marginTop: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Connexion</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Heureux de vous revoir !</p>
      </div>

      <form onSubmit={handleLogin} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={inputContainerStyle}>
          <Mail size={20} color="#999" />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
            required 
          />
        </div>
        <div style={inputContainerStyle}>
          <Lock size={20} color="#999" />
          <input type="password" placeholder="Mot de passe" style={inputStyle} required />
        </div>

        <p style={{ textAlign: 'right', fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>
          Mot de passe oublié ?
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          style={{
            marginTop: '20px',
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
          }}
        >
          Se connecter <ArrowRight size={20} />
        </motion.button>
      </form>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Pas encore de compte ? <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>S'inscrire</span>
        </p>
      </div>
    </div>
  );
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'white',
  padding: '16px',
  borderRadius: '16px',
  border: '1px solid #eee',
  boxShadow: 'var(--shadow-sm)'
};

const inputStyle: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  width: '100%',
  background: 'transparent'
};
