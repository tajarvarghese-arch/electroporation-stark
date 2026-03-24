import { useAppStore } from '../stores/appStore'
import { hoganLessons } from '../data/hoganLessons'

export default function ProgressScreen() {
  const { progress, setScreen } = useAppStore()

  // Build calendar data for last 30 days
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const sessions = progress.history.filter(h => h.date === dateStr && h.completed)
    last30Days.push({ date: dateStr, count: sessions.length, day: d })
  }

  // Lesson breakdown
  const lessonStats = hoganLessons.map(lesson => {
    const count = progress.history.filter(h => h.lessonId === lesson.id && h.completed).length
    return { ...lesson, sessionCount: count }
  })

  // Recent sessions (last 10)
  const recentSessions = [...progress.history]
    .filter(h => h.completed)
    .reverse()
    .slice(0, 10)

  const totalMinutes = progress.totalSessions * 10

  return (
    <div className="screen fade-in">
      <div className="nav-row">
        <button className="btn btn-icon btn-secondary" onClick={() => setScreen('home')}>
          ←
        </button>
        <h2>Your Progress</h2>
      </div>

      {/* Summary stats */}
      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
            {progress.streak}
          </div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
            {progress.totalSessions}
          </div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {totalMinutes}
          </div>
          <div className="stat-label">Minutes</div>
        </div>
      </div>

      {/* 30-day activity */}
      <div className="section-header">Last 30 Days</div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
          {last30Days.map((day, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 4,
                background: day.count > 0 ? 'var(--accent-green)' : 'var(--bg-primary)',
                opacity: day.count > 0 ? Math.min(1, 0.4 + day.count * 0.3) : 0.3,
                position: 'relative'
              }}
              title={`${day.date}: ${day.count} session(s)`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Lesson breakdown */}
      <div className="section-header">By Lesson</div>
      {lessonStats.map(lesson => {
        const maxCount = Math.max(...lessonStats.map(l => l.sessionCount), 1)
        const pct = (lesson.sessionCount / maxCount) * 100
        return (
          <div key={lesson.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {lesson.icon} {lesson.title}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {lesson.sessionCount} sessions
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%`, background: lesson.color }}
              />
            </div>
          </div>
        )
      })}

      {/* Recent activity */}
      {recentSessions.length > 0 && (
        <>
          <div className="section-header">Recent Sessions</div>
          <div className="card" style={{ marginBottom: 40 }}>
            {recentSessions.map((session, i) => {
              const lesson = hoganLessons.find(l => l.id === session.lessonId)
              return (
                <div key={i} className="history-item">
                  <span className="history-date">{formatDate(session.date)}</span>
                  <span className="history-lesson">
                    {lesson?.icon} {lesson?.title || `Lesson ${session.lessonId}`}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {progress.totalSessions === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏌️</div>
          <p style={{ fontSize: 15, lineHeight: 1.5 }}>
            No sessions yet. Complete your first 10-minute session to start tracking your progress!
          </p>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (dateStr === today.toISOString().split('T')[0]) return 'Today'
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
