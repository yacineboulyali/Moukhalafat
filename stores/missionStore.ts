import { create } from 'zustand';

interface QuestionRef {
  index: number;
  type: string;
}

interface MissionStore {
  queues: Record<string, QuestionRef[]>; 
  initQueue: (missionId: string, questions: { question_type: string }[]) => void;
  moveToEnd: (missionId: string) => void;
  markComplete: (missionId: string, index: number) => void;
  getQueue: (missionId: string) => QuestionRef[];
  clearQueue: (missionId: string) => void;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  queues: {},

  initQueue: (missionId, questions) => set(state => {
    if (state.queues[missionId]) return state;
    return {
      queues: { 
        ...state.queues, 
        [missionId]: questions.map((q, i) => ({ index: i, type: q.question_type }))
      }
    };
  }),

  moveToEnd: (missionId) => set(state => {
    const q = state.queues[missionId];
    if (!q || q.length <= 1) return state;
    const [first, ...rest] = q;
    return {
      queues: { ...state.queues, [missionId]: [...rest, first] }
    };
  }),

  markComplete: (missionId, index) => set(state => {
    const q = state.queues[missionId];
    if (!q) return state;
    return {
      queues: { ...state.queues, [missionId]: q.filter(item => item.index !== index) }
    };
  }),

  getQueue: (missionId) => get().queues[missionId] || [],
  
  clearQueue: (missionId) => set(state => {
    const next = { ...state.queues };
    delete next[missionId];
    return { queues: next };
  }),
}));
