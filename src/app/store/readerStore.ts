import { create } from 'zustand';
import { ReaderSession } from '../../features/reader/types';

interface ReaderStore {
  sessions: ReaderSession[];
  activeSessionId: string | null;
  
  openSession: (session: ReaderSession) => void;
  closeSession: (sessionId: string) => void;
  switchSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<ReaderSession>) => void;
  updateCurrentPage: (sessionId: string, page: number) => void;
  
  getActiveSession: () => ReaderSession | null;
  getSession: (sessionId: string) => ReaderSession | null;
}

export const useReaderStore = create<ReaderStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  openSession: (session: ReaderSession) => {
    set((state) => {
      const existingIndex = state.sessions.findIndex(s => s.sessionId === session.sessionId);
      
      if (existingIndex >= 0) {
        return {
          activeSessionId: session.sessionId,
        };
      }
      
      return {
        sessions: [...state.sessions, session],
        activeSessionId: session.sessionId,
      };
    });
  },

  closeSession: (sessionId: string) => {
    set((state) => {
      const newSessions = state.sessions.filter(s => s.sessionId !== sessionId);
      let newActiveId = state.activeSessionId;
      
      if (state.activeSessionId === sessionId) {
        newActiveId = newSessions.length > 0 ? newSessions[newSessions.length - 1].sessionId : null;
      }
      
      return {
        sessions: newSessions,
        activeSessionId: newActiveId,
      };
    });
  },

  switchSession: (sessionId: string) => {
    set({ activeSessionId: sessionId });
  },

  updateSession: (sessionId: string, updates: Partial<ReaderSession>) => {
    set((state) => ({
      sessions: state.sessions.map(s => 
        s.sessionId === sessionId ? { ...s, ...updates } : s
      ),
    }));
  },

  updateCurrentPage: (sessionId: string, page: number) => {
    set((state) => ({
      sessions: state.sessions.map(s => 
        s.sessionId === sessionId ? { ...s, currentPage: page } : s
      ),
    }));
  },

  getActiveSession: () => {
    const state = get();
    return state.sessions.find(s => s.sessionId === state.activeSessionId) ?? null;
  },

  getSession: (sessionId: string) => {
    const state = get();
    return state.sessions.find(s => s.sessionId === sessionId) ?? null;
  },
}));

