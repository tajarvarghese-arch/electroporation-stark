import { useAppStore } from '../stores/appStore'
import { hoganLessons } from '../data/hoganLessons'

export default function LessonDetailScreen() {
  const { activeLessonId, setScreen } = useAppStore()
  const lesson = hoganLessons.find(l => l.id === activeLessonId)

  if (!lesson) {
    return (
      <div className="screen">
        <p>Lesson not found</p>
        <button className="btn btn-secondary" onClick={() => setScreen('home')}>Back</button>
      </div>
    )
  }

  const startPractice = () => {
    useAppStore.getState().startSession()
    useAppStore.getState().setCurrentStep(0)
    useAppStore.getState().setActiveDrill(0)
    setScreen('lesson')
  }

  return (
    <div className="screen fade-in">
      <div className="nav-row">
        <button className="btn btn-icon btn-secondary" onClick={() => setScreen('home')}>
          ←
        </button>
        <h2>Lesson {lesson.id}</h2>
      </div>

      {/* Lesson header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          className="lesson-icon"
          style={{
            background: lesson.color + '20',
            color: lesson.color,
            width: 72,
            height: 72,
            fontSize: 32,
            margin: '0 auto 12px',
            borderRadius: 18
          }}
        >
          {lesson.icon}
        </div>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>{lesson.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{lesson.subtitle}</p>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {lesson.summary}
        </p>
      </div>

      {/* Key Points */}
      <div className="section-header">Key Points</div>
      <div className="card" style={{ marginBottom: 16 }}>
        <ul className="key-points">
          {lesson.keyPoints.map((point, i) => (
            <li key={i} className="key-point">{point}</li>
          ))}
        </ul>
      </div>

      {/* Drills overview */}
      <div className="section-header">Today's Drills ({lesson.drills.length})</div>
      {lesson.drills.map((drill, i) => (
        <div key={i} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                {i + 1}. {drill.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {Math.floor(drill.duration / 60)}:{(drill.duration % 60).toString().padStart(2, '0')} min
                {drill.cameraNeeded && ' · Camera'}
              </div>
            </div>
            {drill.cameraNeeded && (
              <span style={{ fontSize: 11, color: 'var(--accent-blue)', fontWeight: 600 }}>
                POSE TRACKING
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Start button */}
      <div style={{ marginTop: 24, marginBottom: 40 }}>
        <button className="btn btn-primary btn-large" onClick={startPractice}>
          Start 10-Minute Session
        </button>
      </div>
    </div>
  )
}
