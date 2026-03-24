import { create } from 'zustand'
import { SESSION_DURATION } from '../data/hoganLessons'

const STORAGE_KEY = 'hogan-coach-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* ignore */ }
}

const saved = loadProgress()

export const useAppStore = create((set, get) => ({
  // Navigation
  screen: 'home',
  setScreen: (screen) => set({ screen }),

  // Current lesson
  activeLessonId: null,
  activeDrillIndex: 0,
  setActiveLesson: (id) => set({ activeLessonId: id, activeDrillIndex: 0 }),
  setActiveDrill: (index) => set({ activeDrillIndex: index }),
  nextDrill: () => {
    const { activeDrillIndex } = get()
    set({ activeDrillIndex: activeDrillIndex + 1 })
  },

  // Session timer
  sessionTimeRemaining: SESSION_DURATION,
  sessionActive: false,
  sessionStartTime: null,
  startSession: () => set({
    sessionActive: true,
    sessionStartTime: Date.now(),
    sessionTimeRemaining: SESSION_DURATION
  }),
  tickTimer: () => {
    const { sessionStartTime, sessionActive } = get()
    if (!sessionActive || !sessionStartTime) return
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
    const remaining = Math.max(0, SESSION_DURATION - elapsed)
    set({ sessionTimeRemaining: remaining })
    if (remaining === 0) {
      get().completeSession()
    }
  },
  completeSession: () => {
    const { activeLessonId, progress } = get()
    const today = new Date().toISOString().split('T')[0]
    const newHistory = [
      ...progress.history,
      { date: today, lessonId: activeLessonId, completed: true }
    ]
    const streak = calculateStreak(newHistory)
    const newProgress = {
      ...progress,
      history: newHistory,
      streak,
      totalSessions: progress.totalSessions + 1,
      lastSessionDate: today
    }
    saveProgress(newProgress)
    set({
      sessionActive: false,
      sessionStartTime: null,
      sessionTimeRemaining: SESSION_DURATION,
      progress: newProgress
    })
  },

  // Camera
  cameraEnabled: false,
  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),

  // Pose detection results
  poseData: null,
  setPoseData: (data) => set({ poseData: data }),

  // Current drill step
  currentStepIndex: 0,
  setCurrentStep: (index) => set({ currentStepIndex: index }),
  nextStep: () => set(s => ({ currentStepIndex: s.currentStepIndex + 1 })),

  // Progress
  progress: saved || {
    history: [],
    streak: 0,
    totalSessions: 0,
    lastSessionDate: null,
    currentWeek: 1
  },
  setCurrentWeek: (week) => {
    const progress = { ...get().progress, currentWeek: week }
    saveProgress(progress)
    set({ progress })
  }
}))

function calculateStreak(history) {
  if (history.length === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    if (history.some(h => h.date === dateStr && h.completed)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}
