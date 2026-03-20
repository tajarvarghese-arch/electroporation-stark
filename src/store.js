import { create } from 'zustand'

const ROSTER = [
  'Anne', 'Donna', 'Frankie', 'Jill', 'Karina',
  'Renata', 'Rita', 'Susan', 'Teri', 'Trish'
]

function getNextFridays(count = 12) {
  const fridays = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay()
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + (day === 5 ? 0 : daysUntilFriday))

  for (let i = 0; i < count; i++) {
    const friday = new Date(nextFriday)
    friday.setDate(nextFriday.getDate() + i * 7)
    fridays.push(friday.toISOString().split('T')[0])
  }
  return fridays
}

function generateSchedule(roster, fridays) {
  const schedule = {}
  const pool = [...roster]

  fridays.forEach((date, i) => {
    const startIndex = (i * 4) % pool.length
    const players = []
    for (let j = 0; j < 4; j++) {
      players.push(pool[(startIndex + j) % pool.length])
    }
    schedule[date] = { players, substitutions: [] }
  })
  return schedule
}

const STORAGE_KEY = 'innis-tennis-schedule'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      roster: state.roster,
      schedule: state.schedule,
    }))
  } catch { /* ignore */ }
}

const saved = loadState()
const fridays = getNextFridays(12)

const useStore = create((set, get) => ({
  roster: saved?.roster || ROSTER,
  schedule: saved?.schedule || generateSchedule(ROSTER, fridays),
  fridays,

  regenerateSchedule: () => {
    const { roster, fridays } = get()
    const schedule = generateSchedule(roster, fridays)
    set({ schedule })
    saveState({ ...get(), schedule })
  },

  addPlayer: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const { roster } = get()
    if (roster.includes(trimmed)) return
    const newRoster = [...roster, trimmed].sort()
    set({ roster: newRoster })
    saveState(get())
  },

  removePlayer: (name) => {
    const { roster } = get()
    const newRoster = roster.filter(p => p !== name)
    set({ roster: newRoster })
    saveState(get())
  },

  substitutePlayer: (date, oldPlayer, newPlayer, changedBy) => {
    const { schedule } = get()
    const entry = schedule[date]
    if (!entry) return

    const newPlayers = entry.players.map(p => p === oldPlayer ? newPlayer : p)
    const substitution = {
      date: new Date().toISOString(),
      oldPlayer,
      newPlayer,
      changedBy,
    }
    const newEntry = {
      players: newPlayers,
      substitutions: [...entry.substitutions, substitution],
    }
    const newSchedule = { ...schedule, [date]: newEntry }
    set({ schedule: newSchedule })
    saveState({ ...get(), schedule: newSchedule })
  },
}))

export default useStore
