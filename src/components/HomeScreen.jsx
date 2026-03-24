import { useAppStore } from '../stores/appStore'
import { hoganLessons, weeklyPlan } from '../data/hoganLessons'

export default function HomeScreen() {
  const { progress, setScreen, setActiveLesson } = useAppStore()
  const currentPlan = weeklyPlan.find(w => w.week === progress.currentWeek) || weeklyPlan[0]

  const handleStartSession = (lessonId) => {
    setActiveLesson(lessonId)
    setScreen('lesson-detail')
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const practicedToday = progress.history.some(h => h.date === todayStr && h.completed)

  return (
    <div className="screen fade-in">
      <div className="header">
        <div>
          <h1>Hogan Coach</h1>
          <div className="header-sub">Daily Golf Swing Training</div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => setScreen('progress')}
        >
          Progress
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
            {progress.streak}
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
            {progress.totalSessions}
          </div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            Wk {progress.currentWeek}
          </div>
          <div className="stat-label">Program</div>
        </div>
      </div>

      {/* Today's session */}
      <div className="welcome-banner">
        {practicedToday ? (
          <>
            <h2>Great Work Today!</h2>
            <p>You've completed your daily session. Come back tomorrow to keep your streak alive, or do an extra session below.</p>
          </>
        ) : (
          <>
            <h2>Ready for 10 Minutes?</h2>
            <p>{currentPlan.description}. Tap a lesson below to start your daily practice.</p>
          </>
        )}
        <button
          className="btn btn-primary btn-large"
          onClick={() => handleStartSession(currentPlan.focus)}
        >
          {practicedToday ? 'Extra Practice' : "Start Today's Session"}
        </button>
      </div>

      <div className="hogan-quote">
        "Reverse every natural instinct and do the opposite of what you are inclined to do, and you will probably come very close to having a perfect golf swing."
        <cite>— Ben Hogan</cite>
      </div>

      {/* All 5 Lessons */}
      <div className="section-header">The Five Lessons</div>
      {hoganLessons.map((lesson) => {
        const sessionCount = progress.history.filter(h => h.lessonId === lesson.id).length
        const isFocus = lesson.id === currentPlan.focus
        return (
          <div
            key={lesson.id}
            className="card card-interactive lesson-card"
            onClick={() => handleStartSession(lesson.id)}
          >
            <div
              className="lesson-icon"
              style={{ background: lesson.color + '20', color: lesson.color }}
            >
              {lesson.icon}
            </div>
            <div className="lesson-info">
              <div className="lesson-title">
                Lesson {lesson.id}: {lesson.title}
              </div>
              <div className="lesson-subtitle">
                {lesson.subtitle} {sessionCount > 0 && `· ${sessionCount} sessions`}
              </div>
            </div>
            {isFocus && (
              <span
                className="lesson-badge"
                style={{ background: lesson.color + '20', color: lesson.color }}
              >
                Focus
              </span>
            )}
          </div>
        )
      })}

      {/* Week selector */}
      <div className="section-header">Program Week</div>
      <div className="drill-tabs" style={{ marginBottom: 40 }}>
        {weeklyPlan.map((w) => (
          <button
            key={w.week}
            className={`drill-tab ${progress.currentWeek === w.week ? 'active' : ''}`}
            onClick={() => useAppStore.getState().setCurrentWeek(w.week)}
          >
            Week {w.week}
          </button>
        ))}
      </div>
    </div>
  )
}
