import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'cloud' | 'mint' | 'midnight';

interface ThemeState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'cloud',
      setTheme: (t) => set({ theme: t }),
    }),
    { name: 'eduwheel-theme' }
  )
);

