import React, { useState } from 'react'
import useStore from './store'

const COLORS = [
  '#4A90D9', '#5BA55B', '#D4A843', '#C75C5C',
  '#7B68AE', '#D97B4A', '#4AC5C5', '#C54A8A',
  '#6B8E23', '#708090'
]

function getInitials(name) {
  return name.split(/[\s()]+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getColor(name, roster) {
  const idx = roster.indexOf(name)
  return COLORS[idx % COLORS.length]
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })
}

function PlayerBadge({ name, roster, size = 48 }) {
  const color = getColor(name, roster)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 600, fontSize: size * 0.35,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        {getInitials(name)}
      </div>
      <span style={{ fontSize: 12, color: '#555', textAlign: 'center', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </span>
    </div>
  )
}

function SubstitutionModal({ date, players, roster, onClose }) {
  const substitutePlayer = useStore(s => s.substitutePlayer)
  const [step, setStep] = useState('selectOld')
  const [oldPlayer, setOldPlayer] = useState(null)
  const [newPlayer, setNewPlayer] = useState(null)
  const [changedBy, setChangedBy] = useState('')
  const [error, setError] = useState('')

  const availableSubs = roster.filter(p => !players.includes(p))

  const handleSubmit = () => {
    const name = changedBy.trim()
    if (!name) {
      setError('Please enter your name')
      return
    }
    substitutePlayer(date, oldPlayer, newPlayer, name)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24, maxWidth: 420, width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16, color: '#1a365d' }}>
          Make a Substitution
        </h3>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{formatDate(date)}</p>

        {step === 'selectOld' && (
          <>
            <p style={{ fontSize: 14, marginBottom: 12, fontWeight: 500 }}>Who needs to be replaced?</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {players.map(p => (
                <button key={p} onClick={() => { setOldPlayer(p); setStep('selectNew') }}
                  style={{
                    background: 'none', border: '2px solid #e2e8f0', borderRadius: 12,
                    padding: 8, cursor: 'pointer', transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.borderColor = '#4A90D9'}
                  onMouseLeave={e => e.target.style.borderColor = '#e2e8f0'}
                >
                  <PlayerBadge name={p} roster={roster} size={40} />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'selectNew' && (
          <>
            <p style={{ fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
              Replacing <strong>{oldPlayer}</strong>. Select substitute:
            </p>
            {availableSubs.length === 0 ? (
              <p style={{ color: '#999', fontSize: 14 }}>No available substitutes in the roster.</p>
            ) : (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {availableSubs.map(p => (
                  <button key={p} onClick={() => { setNewPlayer(p); setStep('confirm') }}
                    style={{
                      background: 'none', border: '2px solid #e2e8f0', borderRadius: 12,
                      padding: 8, cursor: 'pointer', transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.borderColor = '#5BA55B'}
                    onMouseLeave={e => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <PlayerBadge name={p} roster={roster} size={40} />
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep('selectOld')}
              style={{ marginTop: 12, background: 'none', border: 'none', color: '#4A90D9', cursor: 'pointer', fontSize: 13 }}>
              &larr; Back
            </button>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div style={{
              background: '#f7fafc', borderRadius: 8, padding: 16, marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
            }}>
              <PlayerBadge name={oldPlayer} roster={roster} size={36} />
              <span style={{ fontSize: 20, color: '#999' }}>&rarr;</span>
              <PlayerBadge name={newPlayer} roster={roster} size={36} />
            </div>
            <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Your name (who is making this change):
            </label>
            <input
              type="text"
              value={changedBy}
              onChange={e => { setChangedBy(e.target.value); setError('') }}
              placeholder="Enter your name"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: error ? '2px solid #e53e3e' : '2px solid #e2e8f0',
                fontSize: 14, outline: 'none'
              }}
              autoFocus
            />
            {error && <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setStep('selectNew')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0',
                  background: '#fff', cursor: 'pointer', fontSize: 14
                }}>
                Back
              </button>
              <button onClick={handleSubmit}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                  background: '#4A90D9', color: '#fff', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600
                }}>
                Confirm
              </button>
            </div>
          </>
        )}

        <button onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 16,
            background: 'none', border: 'none', fontSize: 20, color: '#999', cursor: 'pointer'
          }}>
          &times;
        </button>
      </div>
    </div>
  )
}

function ScheduleCard({ date, entry, roster }) {
  const [showSub, setShowSub] = useState(false)

  const isToday = date === new Date().toISOString().split('T')[0]
  const isPast = new Date(date + 'T23:59:59') < new Date()

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: isToday ? '2px solid #4A90D9' : '1px solid #e2e8f0',
      opacity: isPast ? 0.6 : 1,
      position: 'relative'
    }}>
      {isToday && (
        <span style={{
          position: 'absolute', top: -10, right: 12,
          background: '#4A90D9', color: '#fff', fontSize: 11,
          padding: '2px 10px', borderRadius: 10, fontWeight: 600
        }}>TODAY</span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 16, color: '#1a365d', fontWeight: 600 }}>{formatDate(date)}</h3>
          <p style={{ fontSize: 13, color: '#718096' }}>9:30 - 11:00 AM</p>
        </div>
        {!isPast && (
          <button onClick={() => setShowSub(true)}
            style={{
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f7fafc',
              fontSize: 13, cursor: 'pointer', color: '#4A90D9', fontWeight: 500
            }}>
            Sub
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {entry.players.map(p => (
          <PlayerBadge key={p} name={p} roster={roster} />
        ))}
      </div>

      {entry.substitutions.length > 0 && (
        <div style={{ marginTop: 12, borderTop: '1px solid #edf2f7', paddingTop: 10 }}>
          <p style={{ fontSize: 11, color: '#a0aec0', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Changes
          </p>
          {entry.substitutions.map((sub, i) => (
            <p key={i} style={{ fontSize: 12, color: '#718096', marginBottom: 2 }}>
              <strong>{sub.oldPlayer}</strong> &rarr; <strong>{sub.newPlayer}</strong>
              <span style={{ color: '#a0aec0' }}> &middot; by {sub.changedBy} &middot; {new Date(sub.date).toLocaleDateString()}</span>
            </p>
          ))}
        </div>
      )}

      {showSub && (
        <SubstitutionModal
          date={date}
          players={entry.players}
          roster={roster}
          onClose={() => setShowSub(false)}
        />
      )}
    </div>
  )
}

function RosterPanel() {
  const roster = useStore(s => s.roster)
  const addPlayer = useStore(s => s.addPlayer)
  const removePlayer = useStore(s => s.removePlayer)
  const [newName, setNewName] = useState('')
  const [showRoster, setShowRoster] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addPlayer(newName)
    setNewName('')
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0'
    }}>
      <button onClick={() => setShowRoster(!showRoster)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
        <h3 style={{ fontSize: 15, color: '#1a365d', fontWeight: 600 }}>
          Player Roster ({roster.length})
        </h3>
        <span style={{ color: '#999', fontSize: 18 }}>{showRoster ? '▲' : '▼'}</span>
      </button>

      {showRoster && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            {roster.map(p => (
              <div key={p} style={{ position: 'relative' }}>
                <PlayerBadge name={p} roster={roster} size={44} />
                <button onClick={() => removePlayer(p)}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#e53e3e', color: '#fff', border: 'none',
                    fontSize: 11, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                  &times;
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Add player name"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: '2px solid #e2e8f0', fontSize: 14, outline: 'none'
              }}
            />
            <button type="submit"
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: '#5BA55B', color: '#fff', fontSize: 14,
                fontWeight: 600, cursor: 'pointer'
              }}>
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const roster = useStore(s => s.roster)
  const schedule = useStore(s => s.schedule)
  const fridays = useStore(s => s.fridays)
  const regenerateSchedule = useStore(s => s.regenerateSchedule)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 40px' }}>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 10px',
          background: 'linear-gradient(135deg, #1a365d, #2d5a8e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 24
        }}>
          🎾
        </div>
        <h1 style={{ fontSize: 22, color: '#1a365d', fontWeight: 700 }}>Innis Arden</h1>
        <p style={{ fontSize: 14, color: '#718096' }}>Friday Tennis &middot; 9:30 - 11:00 AM</p>
      </header>

      <div style={{ marginBottom: 16 }}>
        <RosterPanel />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, color: '#1a365d', fontWeight: 600 }}>Schedule</h2>
        <button onClick={regenerateSchedule}
          style={{
            padding: '6px 14px', borderRadius: 8,
            border: '1px solid #e2e8f0', background: '#fff',
            fontSize: 13, cursor: 'pointer', color: '#718096'
          }}>
          Regenerate
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fridays.map(date => (
          schedule[date] && (
            <ScheduleCard key={date} date={date} entry={schedule[date]} roster={roster} />
          )
        ))}
      </div>
    </div>
  )
}
