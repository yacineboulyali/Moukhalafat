import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { useQuestions } from '../../hooks/useContent';
import { Modal, Field, Input, Textarea, Toggle, Toast, Confirm } from './CmsUI';

const QUESTION_TYPES = [
  { value: 'multiple_choice',   label: '🔘 QCM (choix multiple)' },
  { value: 'true_false',        label: '✅ Vrai / Faux' },
  { value: 'fill_blanks',       label: '✏️ Compléter les blancs' },
  { value: 'matching',          label: '🔗 Association' },
  { value: 'ranking',           label: '📊 Classement' },
  { value: 'short_answer',      label: '💬 Réponse courte' },
  { value: 'scenario_decision', label: '🎭 Décision scénario' },
  { value: 'puzzle_riddle',     label: '🧩 Devinette / Puzzle' },
  { value: 'error_detection',   label: '🔍 Détection d\'erreurs' },
];

const EMPTY = {
  question_fr: '', question_ar: '', question_type: 'multiple_choice',
  options: [], correct_answer: '',
  score_decision: 0, score_equipe: 0, score_stress: 0,
  xp_reward: 20, time_limit_sec: 30,
  hint_fr: '', explanation_fr: '',
  sort_order: 0, is_published: false,
};

function OptionsEditor({ options, onChange }) {
  const opts = Array.isArray(options) ? options : [];

  const addOption = () => {
    onChange([...opts, { id: `opt_${Date.now()}`, label_fr: '', label_ar: '' }]);
  };

  const updateOpt = (idx, key, val) => {
    const next = opts.map((o, i) => i === idx ? { ...o, [key]: val } : o);
    onChange(next);
  };

  const removeOpt = (idx) => {
    onChange(opts.filter((_, i) => i !== idx));
  };

  return (
    <div className="options-editor">
      <div className="options-list">
        {opts.map((opt, i) => (
          <div key={opt.id || i} className="option-row">
            <span className="option-idx">{String.fromCharCode(65 + i)}</span>
            <input
              className="cms-input"
              value={opt.label_fr}
              onChange={e => updateOpt(i, 'label_fr', e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)} (FR)`}
              style={{ flex: 1 }}
            />
            <input
              className="cms-input"
              value={opt.label_ar}
              onChange={e => updateOpt(i, 'label_ar', e.target.value)}
              placeholder="Arabe"
              dir="rtl"
              style={{ flex: 1 }}
            />
            <button className="icon-btn danger" onClick={() => removeOpt(i)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ fontSize:12, padding:'6px 14px' }} onClick={addOption}>
        <Plus size={13} /> Ajouter une option
      </button>
    </div>
  );
}

export default function QuestionsManager({ mission, challenge, onBack }) {
  const { questions, loading, save, remove } = useQuestions(mission?.id);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => setModal({ ...EMPTY });
  const openEdit = (q) => setModal({ ...q, options: Array.isArray(q.options) ? q.options : [] });
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal.question_fr) { showToast('La question est obligatoire', 'error'); return; }
    setSaving(true);
    try {
      await save(modal);
      showToast(modal.id ? 'Question mise à jour ✓' : 'Question créée ✓');
      closeModal();
    } catch(e) {
      showToast('Erreur : ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    await remove(confirm.id);
    setConfirm(null);
    showToast('Question supprimée');
  };

  const set = (key, val) => setModal(m => ({ ...m, [key]: val }));

  const needsOptions = ['multiple_choice','matching','ranking'].includes(modal?.question_type);

  if (!mission) return null;

  return (
    <div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <Confirm
        open={!!confirm}
        message={`Supprimer cette question ?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      {/* Breadcrumb */}
      <div className="cms-breadcrumb">
        <button className="btn btn-ghost" onClick={() => onBack('challenges')} style={{ padding:'6px 12px', fontSize:13 }}>← Défis</button>
        <span className="crumb-sep">/</span>
        <button className="btn btn-ghost" onClick={() => onBack('missions')} style={{ padding:'6px 12px', fontSize:13, color: challenge?.city_color }}>
          {challenge?.city_name_fr}
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">Questions</span>
      </div>

      {/* Header */}
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">❓ Questions</h2>
          <p className="cms-section-sub">
            Mission : <strong>{mission.title_fr}</strong> · {questions.length} questions
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nouvelle question
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Chargement...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" style={{ fontSize:48, display:'block', marginBottom:8 }}>❓</span>
          <h3>Aucune question</h3>
          <p>Crée la première question pour cette mission</p>
          <button className="btn btn-primary" style={{ marginTop:16 }} onClick={openNew}>
            <Plus size={16} /> Ajouter une question
          </button>
        </div>
      ) : (
        <div className="question-list">
          {questions.map((q, i) => (
            <div key={q.id} className="question-row">
              <div className="question-num">Q{i + 1}</div>
              <div className="question-body">
                <div className="question-text">{q.question_fr}</div>
                <div style={{ display:'flex', gap:8, marginTop:6, flexWrap:'wrap' }}>
                  <span className="q-type-chip">
                    {QUESTION_TYPES.find(t => t.value === q.question_type)?.label || q.question_type}
                  </span>
                  <span style={{ fontSize:11, color:'#67e8f9' }}>⏱ {q.time_limit_sec}s</span>
                  <span style={{ fontSize:11, color:'#fcd34d' }}>⚡ {q.xp_reward} XP</span>
                  {q.score_decision > 0 && <span style={{ fontSize:11, color:'#a78bfa' }}>🧠 D:{q.score_decision}</span>}
                  {q.score_equipe > 0 && <span style={{ fontSize:11, color:'#67e8f9' }}>🤝 E:{q.score_equipe}</span>}
                  {q.score_stress > 0 && <span style={{ fontSize:11, color:'#fcd34d' }}>🌀 S:{q.score_stress}</span>}
                </div>
                {Array.isArray(q.options) && q.options.length > 0 && (
                  <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                    {q.options.map((o, oi) => (
                      <span key={oi} className={`q-option ${o.id === q.correct_answer ? 'correct' : ''}`}>
                        {String.fromCharCode(65+oi)}. {o.label_fr}
                        {o.id === q.correct_answer && ' ✓'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span className={`pub-tag ${q.is_published ? 'pub' : 'draft'}`}>
                  {q.is_published ? '✅' : '📝'}
                </span>
                <button className="icon-btn" onClick={() => openEdit(q)}><Edit2 size={15} /></button>
                <button className="icon-btn danger" onClick={() => setConfirm(q)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal?.id ? 'Modifier la question' : 'Nouvelle question'} wide>
        {modal && (
          <div className="modal-form">
            <Field label="Type de question">
              <select className="cms-select" value={modal.question_type} onChange={e => set('question_type', e.target.value)}>
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>

            <div className="form-row-2">
              <Field label="Question (FR) *">
                <Textarea value={modal.question_fr} onChange={v => set('question_fr', v)} placeholder="Quelle est la compétence principale de…" rows={3} />
              </Field>
              <Field label="Question (AR)">
                <Textarea value={modal.question_ar} onChange={v => set('question_ar', v)} placeholder="ما هي الكفاءة الأساسية…" rows={3} dir="rtl" />
              </Field>
            </div>

            {needsOptions && (
              <Field label="Options de réponse" hint="La bonne réponse sera choisie via l'ID ci-dessous">
                <OptionsEditor options={modal.options} onChange={v => set('options', v)} />
              </Field>
            )}

            {(needsOptions || modal.question_type === 'true_false') && (
              <Field label="Bonne réponse" hint={modal.question_type === 'true_false' ? '"vrai" ou "faux"' : "ID de l'option correcte (ex: opt_xxx)"}>
                {modal.question_type === 'true_false' ? (
                  <select className="cms-select" value={modal.correct_answer} onChange={e => set('correct_answer', e.target.value)}>
                    <option value="">— Choisir —</option>
                    <option value="vrai">✅ Vrai</option>
                    <option value="faux">❌ Faux</option>
                  </select>
                ) : (
                  <select className="cms-select" value={modal.correct_answer} onChange={e => set('correct_answer', e.target.value)}>
                    <option value="">— Sélectionner la bonne option —</option>
                    {(modal.options || []).map((o, i) => (
                      <option key={o.id} value={o.id}>{String.fromCharCode(65+i)}. {o.label_fr}</option>
                    ))}
                  </select>
                )}
              </Field>
            )}

            {modal.question_type === 'short_answer' && (
              <Field label="Réponse attendue (mot-clé)">
                <Input value={modal.correct_answer} onChange={v => set('correct_answer', v)} placeholder="Ex: négociation" />
              </Field>
            )}

            {/* Scores compétences */}
            <div className="skill-scores-section">
              <p className="field-label">🎯 Impact sur les compétences (0–100)</p>
              <div className="form-row-3">
                <Field label="🧠 Décision">
                  <Input type="number" value={modal.score_decision} onChange={v => set('score_decision', parseInt(v)||0)} min="0" max="100" />
                </Field>
                <Field label="🤝 Équipe">
                  <Input type="number" value={modal.score_equipe} onChange={v => set('score_equipe', parseInt(v)||0)} min="0" max="100" />
                </Field>
                <Field label="🌀 Stress">
                  <Input type="number" value={modal.score_stress} onChange={v => set('score_stress', parseInt(v)||0)} min="0" max="100" />
                </Field>
              </div>
            </div>

            <div className="form-row-3">
              <Field label="⚡ XP accordés">
                <Input type="number" value={modal.xp_reward} onChange={v => set('xp_reward', parseInt(v)||0)} min="0" />
              </Field>
              <Field label="⏱ Limite de temps (sec)">
                <Input type="number" value={modal.time_limit_sec} onChange={v => set('time_limit_sec', parseInt(v)||30)} min="10" max="300" />
              </Field>
              <Field label="Ordre">
                <Input type="number" value={modal.sort_order} onChange={v => set('sort_order', parseInt(v)||0)} min="0" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="💡 Indice (FR)">
                <Input value={modal.hint_fr} onChange={v => set('hint_fr', v)} placeholder="Pense à…" />
              </Field>
              <Field label="📖 Explication (après réponse)">
                <Input value={modal.explanation_fr} onChange={v => set('explanation_fr', v)} placeholder="La bonne réponse est… parce que…" />
              </Field>
            </div>

            <Toggle value={modal.is_published} onChange={v => set('is_published', v)} label="Question publiée (active dans le jeu)" />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:16 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : (modal.id ? 'Mettre à jour' : 'Créer la question')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
