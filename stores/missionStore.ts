import { create } from 'zustand';

interface QuestionRef {
  index: number;
  type: string;
}

interface MissionResult {
  questionIndex: number;
  isCorrect: boolean;
}

interface MissionStore {
  queues: Record<string, QuestionRef[]>; 
  results: Record<string, MissionResult[]>;
  initQueue: (missionId: string, questions: { question_type: string }[]) => void;
  moveToEnd: (missionId: string) => void;
  markComplete: (missionId: string, index: number) => void;
  recordResult: (missionId: string, index: number, isCorrect: boolean) => void;
  getQueue: (missionId: string) => QuestionRef[];
  getResults: (missionId: string) => MissionResult[];
  clearQueue: (missionId: string) => void;
  clearResults: (missionId: string) => void;
  retryFailed: (missionId: string, questions: { question_type: string }[]) => void;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  queues: {},
  results: {},

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

  recordResult: (missionId, index, isCorrect) => set(state => {
    const prev = state.results[missionId] || [];
    // Update or add
    const filtered = prev.filter(r => r.questionIndex !== index);
    return {
      results: {
        ...state.results,
        [missionId]: [...filtered, { questionIndex: index, isCorrect }]
      }
    };
  }),

  getQueue: (missionId) => get().queues[missionId] || [],
  getResults: (missionId) => get().results[missionId] || [],
  
  clearQueue: (missionId) => set(state => {
    const next = { ...state.queues };
    delete next[missionId];
    return { queues: next };
  }),

  clearResults: (missionId) => set(state => {
    const next = { ...state.results };
    delete next[missionId];
    return { results: next };
  }),

  retryFailed: (missionId, questions) => set(state => {
    const missionResults = state.results[missionId] || [];
    const failedIndices = missionResults.filter(r => !r.isCorrect).map(r => r.questionIndex);
    
    if (failedIndices.length === 0) return state;

    return {
      queues: {
        ...state.queues,
        [missionId]: questions
          .map((q, i) => ({ index: i, type: q.question_type }))
          .filter(q => failedIndices.includes(q.index))
      },
      // Keep results but we might want to clear them or update them as they retry
    };
  }),
}));
