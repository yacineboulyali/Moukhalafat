import { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { Users, Award, Zap, TrendingUp, Search, RefreshCw, ChevronRight } from 'lucide-react';
import { useStats, usePlayers, useSkillDistribution, useCityStats } from '../hooks/useData';
import PlayerPanel from './PlayerPanel';

function getInitials(name) {
  return (name || 'J').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getLevelClass(level) {
  return `lvl-${Math.min(level || 1, 5)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-value" style={{ color: p.color || 'var(--primary-light)' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { players, loading: playersLoading } = usePlayers();
  const { data: skillData } = useSkillDistribution();
  const { data: cityData } = useCityStats();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = players.filter(p =>
    (p.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.profile_type || '').toLowerCase().includes(search.toLowerCase())
  );

  const radarData = skillData.map(s => ({ subject: s.skill, A: s.avg }));

  return (
    <>
      <PlayerPanel player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />

      {/* Stats Grid */}
      <div className="stats-grid fade-in">
        <div className="stat-card violet fade-in fade-in-delay-1">
          <div className="stat-icon violet"><Users size={22} color="#a78bfa" /></div>
          <div className="stat-value violet">{statsLoading ? '—' : stats.totalPlayers}</div>
          <div className="stat-label">Joueurs inscrits</div>
          <span className="stat-trend up">Total</span>
        </div>
        <div className="stat-card cyan fade-in fade-in-delay-2">
          <div className="stat-icon cyan"><TrendingUp size={22} color="#67e8f9" /></div>
          <div className="stat-value cyan">{statsLoading ? '—' : stats.activePlayers}</div>
          <div className="stat-label">Joueurs actifs (streak)</div>
          <span className="stat-trend up">🔥 Streak</span>
        </div>
        <div className="stat-card amber fade-in fade-in-delay-3">
          <div className="stat-icon amber"><Award size={22} color="#fcd34d" /></div>
          <div className="stat-value amber">{statsLoading ? '—' : stats.totalBadges}</div>
          <div className="stat-label">Badges obtenus</div>
          <span className="stat-trend up">🏅 Total</span>
        </div>
        <div className="stat-card green fade-in fade-in-delay-4">
          <div className="stat-icon green"><Zap size={22} color="#34d399" /></div>
          <div className="stat-value green">{statsLoading ? '—' : stats.avgXP.toLocaleString()}</div>
          <div className="stat-label">XP moyen par joueur</div>
          <span className="stat-trend up">✨ Moy.</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        {/* Radar Skills */}
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon">⚡</div>
              <h3>Compétences moyennes</h3>
            </div>
          </div>
          <div className="card-body">
            {skillData.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📊</span>
                <h3>Pas de données</h3>
                <p>Les scores de compétences apparaîtront ici</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border-light)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* City Bar */}
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon">🗺️</div>
              <h3>Avancement par ville</h3>
            </div>
          </div>
          <div className="card-body">
            {cityData.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🏙️</span>
                <h3>Pas de données</h3>
                <p>Les progressions par ville apparaîtront ici</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cityData} barSize={14} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis dataKey="city" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="done" name="Terminé" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="current" name="En cours" fill="#7c3aed" radius={[4,4,0,0]} />
                  <Bar dataKey="locked" name="Verrouillé" fill="#6060a0" radius={[4,4,0,0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">👤</div>
            <h3>Joueurs & Progression</h3>
          </div>
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {playersLoading ? (
            <div className="loading"><div className="spinner" /> Chargement des joueurs...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>Aucun joueur trouvé</h3>
              <p>Aucun résultat pour « {search} »</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Niveau</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Type de profil</th>
                  <th>Inscrit le</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((player, i) => {
                  const xpProgress = player.xp % 100;
                  const joinDate = new Date(player.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  });

                  return (
                    <tr key={player.id} onClick={() => setSelectedPlayer(player)} style={{ animationDelay: `${i * 0.04}s` }}>
                      <td>
                        <div className="player-info">
                          <div className="player-avatar">{getInitials(player.display_name)}</div>
                          <div>
                            <div className="player-name">{player.display_name || 'Joueur'}</div>
                            <div className="player-type">ID: {player.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`level-badge ${getLevelClass(player.level)}`}>
                          ⭐ Niveau {player.level}
                        </span>
                      </td>
                      <td>
                        <div className="progress-wrap">
                          <div className="progress-bar">
                            <div className="progress-fill violet" style={{ width: `${xpProgress}%` }} />
                          </div>
                          <span className="progress-text">{player.xp?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: player.streak_days > 0 ? '#fcd34d' : 'var(--text-muted)', fontWeight: 600 }}>
                          {player.streak_days > 0 ? `🔥 ${player.streak_days}j` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="skill-chip decision">{player.profile_type || 'Le Stratège'}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{joinDate}</td>
                      <td>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
