import { useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import BadgesPage from './components/BadgesPage';
import ContentPage from './components/ContentPage';
import {
  LayoutDashboard, Users, Award, FileEdit,
} from 'lucide-react';

const NAV = [
  {
    section: 'Analytique',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
      { id: 'players',   icon: Users,           label: 'Joueurs' },
      { id: 'badges',    icon: Award,           label: 'Badges' },
    ]
  },
  {
    section: 'Gestion de contenu',
    items: [
      { id: 'content', icon: FileEdit, label: 'Défis & Missions', badge: 'CMS' },
    ]
  }
];

const PAGE_TITLES = {
  dashboard: { title: 'Tableau de bord',          sub: 'Vue générale de l\'avancement des joueurs' },
  players:   { title: 'Joueurs',                  sub: 'Liste et profils détaillés des joueurs' },
  badges:    { title: 'Badges & Récompenses',     sub: 'Analyse des badges obtenus par les joueurs' },
  content:   { title: 'Gestion de contenu',       sub: 'Créer et modifier les défis, missions et questions du jeu' },
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { title, sub } = PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🧭</div>
            <div className="logo-text">
              <span className="logo-title">Voyage des Comp.</span>
              <span className="logo-subtitle">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <span className="nav-section-title">{section}</span>
              {items.map(({ id, icon: Icon, label, badge }) => (
                <div
                  key={id}
                  className={`nav-item ${page === id ? 'active' : ''}`}
                  onClick={() => setPage(id)}
                >
                  <Icon size={18} className="icon" />
                  {label}
                  {badge && <span className="nav-badge">{badge}</span>}
                </div>
              ))}
            </div>
          ))}

          <div className="divider" style={{ margin: '12px 0' }} />
          <span className="nav-section-title">Villes du jeu</span>
          {['🏛️ Rabat', '🔵 Chefchaouen', '🕌 Fès', '🌿 Marrakech', '🌊 Laâyoune', '🏜️ Dakhla'].map(city => (
            <div key={city} className="nav-item" style={{ fontSize: 12, opacity: 0.7, cursor: 'default' }}>
              {city}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className="status-dot" />
            Supabase connecté
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{title}</h1>
            <span>{sub}</span>
          </div>
        </header>

        <main className="page-content">
          {page === 'dashboard' && <Dashboard />}
          {page === 'players'   && <Dashboard />}
          {page === 'badges'    && <BadgesPage />}
          {page === 'content'   && <ContentPage />}
        </main>
      </div>
    </div>
  );
}
