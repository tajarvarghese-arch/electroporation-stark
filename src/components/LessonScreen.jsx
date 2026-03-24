import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../stores/appStore'
import { hoganLessons } from '../data/hoganLessons'
import CameraView from './CameraView'

export default function LessonScreen() {
  const {
    activeLessonId, activeDrillIndex, sessionTimeRemaining, sessionActive,
    tickTimer, setScreen, setActiveDrill, currentStepIndex, setCurrentStep,
    cameraEnabled, setCameraEnabled, completeSession
  } = useAppStore()

  const lesson = hoganLessons.find(l => l.id === activeLessonId)
  const timerRef = useRef(null)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(tickTimer, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [sessionActive])

  useEffect(() => {
    if (sessionTimeRemaining === 0 && sessionActive) {
      setShowComplete(true)
    }
  }, [sessionTimeRemaining])

  if (!lesson) return null

  const drill = lesson.drills[activeDrillIndex]
  if (!drill && !showComplete) {
    return <CompletionView onHome={() => setScreen('home')} lesson={lesson} />
  }

  if (showComplete) {
    return <CompletionView onHome={() => setScreen('home')} lesson={lesson} />
  }

  const minutes = Math.floor(sessionTimeRemaining / 60)
  const seconds = sessionTimeRemaining % 60
  const totalDrills = lesson.drills.length

  const handleNextDrill = () => {
    setCurrentStep(0)
    if (activeDrillIndex < totalDrills - 1) {
      setActiveDrill(activeDrillIndex + 1)
    } else {
      completeSession()
      setShowComplete(true)
    }
  }

  const handleEndSession = () => {
    completeSession()
    setShowComplete(true)
  }

  return (
    <div className="screen fade-in" style={{ paddingBottom: 100 }}>
      {/* Top bar with timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 'env(safe-area-inset-top, 8px)' }}>
        <button className="btn btn-ghost" onClick={handleEndSession}>End</button>
        <div style={{ textAlign: 'center' }}>
          <div className="timer-display" style={{ fontSize: 28 }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>remaining</div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => setCameraEnabled(!cameraEnabled)}
          style={{ fontSize: 20 }}
        >
          {cameraEnabled ? '📷' : '📷'}
        </button>
      </div>

      {/* Progress indicator */}
      <div className="progress-bar-container" style={{ marginBottom: 20 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${((activeDrillIndex + 1) / totalDrills) * 100}%`,
            background: lesson.color
          }}
        />
      </div>

      {/* Drill tabs */}
      <div className="drill-tabs">
        {lesson.drills.map((d, i) => (
          <button
            key={i}
            className={`drill-tab ${i === activeDrillIndex ? 'active' : ''}`}
            onClick={() => { setActiveDrill(i); setCurrentStep(0) }}
            style={i === activeDrillIndex ? { background: lesson.color, borderColor: lesson.color } : {}}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Drill content */}
      <div className="drill-header">
        <div>
          <div className="drill-name">{drill.name}</div>
          <div className="drill-counter">
            Drill {activeDrillIndex + 1} of {totalDrills}
          </div>
        </div>
      </div>

      <p className="drill-description">{drill.description}</p>

      {/* Camera view */}
      {cameraEnabled && drill.cameraNeeded && (
        <CameraView poseTargets={drill.poseTargets} lessonColor={lesson.color} />
      )}

      {/* Enable camera prompt */}
      {!cameraEnabled && drill.cameraNeeded && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: 24,
            marginBottom: 16,
            cursor: 'pointer'
          }}
          onClick={() => setCameraEnabled(true)}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            Pose Tracking Available
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Tap to enable camera for real-time feedback on your form
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="section-header">Steps</div>
      <ol className="step-list">
        {drill.steps.map((step, i) => (
          <li
            key={i}
            className="step-item"
            onClick={() => setCurrentStep(i)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`step-number ${i === currentStepIndex ? 'active' : i < currentStepIndex ? 'completed' : ''}`}>
              {i < currentStepIndex ? '✓' : i + 1}
            </div>
            <span className={`step-text ${i === currentStepIndex ? 'active' : ''}`}>
              {step}
            </span>
          </li>
        ))}
      </ol>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {currentStepIndex < drill.steps.length - 1 ? (
          <button
            className="btn btn-primary btn-large"
            onClick={() => setCurrentStep(currentStepIndex + 1)}
          >
            Next Step
          </button>
        ) : (
          <button
            className="btn btn-primary btn-large"
            onClick={handleNextDrill}
            style={{ background: lesson.color }}
          >
            {activeDrillIndex < totalDrills - 1 ? 'Next Drill →' : 'Complete Session'}
          </button>
        )}
      </div>
    </div>
  )
}

function CompletionView({ onHome, lesson }) {
  const progress = useAppStore(s => s.progress)

  return (
    <div className="completion-screen fade-in">
      <div className="completion-icon">🏌️</div>
      <div className="completion-title">Session Complete!</div>
      <div className="completion-sub">
        Great work on <strong>Lesson {lesson.id}: {lesson.title}</strong>.
        You've completed {progress.totalSessions} total sessions with a {progress.streak}-day streak.
        Consistency is the key to building muscle memory.
      </div>

      <div className="hogan-quote" style={{ maxWidth: 320, marginBottom: 32 }}>
        "The most important shot in golf is the next one."
        <cite>— Ben Hogan</cite>
      </div>

      <button className="btn btn-primary btn-large" style={{ maxWidth: 320 }} onClick={onHome}>
        Back to Home
      </button>
    </div>
  )
}
