import { useAppStore } from './stores/appStore'
import HomeScreen from './components/HomeScreen'
import LessonScreen from './components/LessonScreen'
import ProgressScreen from './components/ProgressScreen'
import LessonDetailScreen from './components/LessonDetailScreen'

export default function App() {
  const screen = useAppStore(s => s.screen)

  return (
    <div className="app-container">
      {screen === 'home' && <HomeScreen />}
      {screen === 'lesson-detail' && <LessonDetailScreen />}
      {screen === 'lesson' && <LessonScreen />}
      {screen === 'progress' && <ProgressScreen />}
    </div>
  )
}
