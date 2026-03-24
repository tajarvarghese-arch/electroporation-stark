import { useRef, useEffect, useState, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'

// Skeleton connection pairs for drawing pose
const SKELETON_CONNECTIONS = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle']
]

const KEYPOINT_NAMES = [
  'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
  'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
  'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
]

export default function CameraView({ poseTargets, lessonColor }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const detectorRef = useRef(null)
  const animFrameRef = useRef(null)
  const [status, setStatus] = useState('initializing')
  const [feedback, setFeedback] = useState(null)
  const setPoseData = useAppStore(s => s.setPoseData)

  const startCamera = useCallback(async () => {
    try {
      setStatus('requesting camera...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStatus('loading pose model...')
        await loadPoseModel()
        setStatus('active')
      }
    } catch (err) {
      console.error('Camera error:', err)
      setStatus('camera-denied')
    }
  }, [])

  const loadPoseModel = useCallback(async () => {
    try {
      const tf = await import('@tensorflow/tfjs-core')
      await import('@tensorflow/tfjs-backend-webgl')
      await tf.setBackend('webgl')
      await tf.ready()

      const poseDetection = await import('@tensorflow-models/pose-detection')
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
      )
      detectorRef.current = detector
      runDetection()
    } catch (err) {
      console.error('Pose model error:', err)
      setStatus('model-error')
    }
  }, [])

  const runDetection = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current) return
    if (videoRef.current.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(runDetection)
      return
    }

    try {
      const poses = await detectorRef.current.estimatePoses(videoRef.current)
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints
        setPoseData(keypoints)
        drawPose(keypoints)
        analyzePose(keypoints)
      }
    } catch (err) {
      // Silently continue on detection errors
    }

    animFrameRef.current = requestAnimationFrame(runDetection)
  }, [])

  const drawPose = useCallback((keypoints) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Build keypoint map
    const kpMap = {}
    keypoints.forEach(kp => {
      kpMap[kp.name] = kp
    })

    // Draw connections
    ctx.strokeStyle = lessonColor || '#22c55e'
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.8

    SKELETON_CONNECTIONS.forEach(([a, b]) => {
      const kpA = kpMap[a]
      const kpB = kpMap[b]
      if (kpA && kpB && kpA.score > 0.3 && kpB.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(kpA.x, kpA.y)
        ctx.lineTo(kpB.x, kpB.y)
        ctx.stroke()
      }
    })

    // Draw keypoints
    keypoints.forEach(kp => {
      if (kp.score > 0.3) {
        ctx.globalAlpha = Math.min(1, kp.score + 0.2)
        ctx.fillStyle = lessonColor || '#22c55e'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
        ctx.fill()

        // White inner dot
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 2, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    ctx.globalAlpha = 1
  }, [lessonColor])

  const analyzePose = useCallback((keypoints) => {
    const kpMap = {}
    keypoints.forEach(kp => { kpMap[kp.name] = kp })

    const messages = []

    // Check basic posture if we have enough keypoints
    const lShoulder = kpMap['left_shoulder']
    const rShoulder = kpMap['right_shoulder']
    const lHip = kpMap['left_hip']
    const rHip = kpMap['right_hip']
    const lKnee = kpMap['left_knee']
    const rKnee = kpMap['right_knee']

    if (lShoulder?.score > 0.4 && rShoulder?.score > 0.4) {
      const shoulderDiff = Math.abs(lShoulder.y - rShoulder.y)
      if (shoulderDiff > 30) {
        messages.push('Level your shoulders')
      }
    }

    if (lShoulder?.score > 0.4 && lHip?.score > 0.4 && lKnee?.score > 0.4) {
      const hipAngle = calculateAngle(lShoulder, lHip, lKnee)
      if (hipAngle > 170) {
        messages.push('Bend more from the hips')
      } else if (hipAngle < 130) {
        messages.push('Stand a bit taller — too much hip bend')
      } else {
        messages.push('Hip hinge looks good!')
      }
    }

    if (lHip?.score > 0.4 && lKnee?.score > 0.4) {
      const kneeFlex = calculateAngle(lHip, lKnee, { x: lKnee.x, y: lKnee.y + 100 })
      if (kneeFlex > 178) {
        messages.push('Add a slight knee flex')
      }
    }

    if (messages.length > 0) {
      setFeedback(messages.join(' · '))
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  if (status === 'camera-denied') {
    return (
      <div className="camera-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20 }}>
        <p style={{ fontSize: 32, marginBottom: 12 }}>📷</p>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Camera access was denied. Enable camera in your browser settings to use pose tracking.
        </p>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={startCamera}>
          Try Again
        </button>
      </div>
    )
  }

  if (status === 'model-error') {
    return (
      <div className="camera-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20 }}>
        <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Could not load pose detection model. Your device may not support WebGL. You can still follow the drills without camera tracking.
        </p>
      </div>
    )
  }

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-video" playsInline muted />
      <canvas ref={canvasRef} className="camera-canvas" />
      <div className="camera-overlay">
        <span className="camera-badge" style={{ color: status === 'active' ? '#22c55e' : '#f59e0b' }}>
          {status === 'active' ? '● POSE TRACKING' : status.toUpperCase()}
        </span>
      </div>
      {feedback && (
        <div className="pose-feedback">
          {feedback}
        </div>
      )}
    </div>
  )
}

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180 / Math.PI)
  if (angle > 180) angle = 360 - angle
  return angle
}
