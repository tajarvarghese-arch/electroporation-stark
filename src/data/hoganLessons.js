// Based on Ben Hogan's "Five Lessons: The Modern Fundamentals of Golf" (1957)
// Each lesson maps to a chapter of the book with drills and pose checkpoints.

export const hoganLessons = [
  {
    id: 1,
    title: 'The Grip',
    subtitle: 'The Foundation of Every Swing',
    icon: '🤝',
    color: '#22c55e',
    summary:
      'Hogan considered the grip the single most important fundamental. A correct grip unifies your hands so they work as a single unit, controls the clubface, and lets your wrists hinge naturally.',
    keyPoints: [
      'Left hand: Club sits diagonally across the palm from the base of the pinky to the middle of the index finger',
      'The V formed by left thumb and index finger points to your right shoulder',
      'Right hand: Club held in the fingers, not the palm',
      'Right pinky overlaps or interlocks with left index finger',
      'Right hand V also points to your right shoulder',
      'Grip pressure is firm but not tense — like holding a bird'
    ],
    drills: [
      {
        name: 'Grip Check Drill',
        duration: 120,
        description: 'Place your left hand on the club. Check that you can see exactly 2-2.5 knuckles when you look down. The V points to your right shoulder.',
        cameraNeeded: false,
        steps: [
          'Hold the club in your left hand only',
          'Look down — you should see 2 to 2.5 knuckles',
          'Check the V between thumb and index finger aims at your right shoulder',
          'Now add your right hand — pinky overlaps left index finger',
          'Right hand V should also point to your right shoulder',
          'Squeeze and release 10 times to find the right pressure'
        ]
      },
      {
        name: 'Waggle Drill',
        duration: 120,
        description: 'With your grip set, waggle the club back and forth. Your wrists should hinge freely. If they feel locked, your grip is too tight.',
        cameraNeeded: false,
        steps: [
          'Set your grip as practiced',
          'Address an imaginary ball',
          'Waggle the club head back and forth with your wrists',
          'The motion should feel smooth and effortless',
          'If stiff, lighten your grip pressure slightly',
          'Repeat 20 waggles, maintaining consistent grip'
        ]
      },
      {
        name: 'One-Hand Swings',
        duration: 60,
        description: 'Make slow half-swings with just your left hand, then just your right. Feel how each hand contributes.',
        cameraNeeded: false,
        steps: [
          'Left hand only: make 10 slow half-swings',
          'Feel the club weight in your fingers',
          'Right hand only: make 10 slow half-swings',
          'Notice how the right hand controls direction',
          'Now combine: full grip, 10 slow half-swings',
          'Both hands should feel unified'
        ]
      }
    ],
    poseChecks: [
      { checkpoint: 'hands_together', description: 'Hands unified on club, no gaps' },
      { checkpoint: 'wrist_hinge', description: 'Wrists can hinge freely in waggle' }
    ]
  },
  {
    id: 2,
    title: 'Stance & Posture',
    subtitle: 'Your Athletic Foundation',
    icon: '🧍',
    color: '#3b82f6',
    summary:
      'Hogan described the correct stance as an athletic, balanced position. Your posture determines your swing plane, balance, and ability to rotate. Get this right and everything else becomes easier.',
    keyPoints: [
      'Feet shoulder-width apart for mid-irons, slightly wider for driver',
      'Weight balanced 50/50 between feet, slightly favoring the balls of your feet',
      'Bend from the hips (not the waist) — your back stays straight',
      'Knees slightly flexed, like sitting on a tall barstool',
      'Arms hang naturally from your shoulders',
      'Chin up — leave room for your shoulder to turn under'
    ],
    drills: [
      {
        name: 'Wall Posture Drill',
        duration: 120,
        description: 'Stand with your back against a wall. Bend forward from the hips keeping your back flat against the wall as long as possible.',
        cameraNeeded: true,
        steps: [
          'Stand with your back flat against a wall',
          'Place feet shoulder-width apart, 12 inches from the wall',
          'Bend forward from the hips, keeping your back on the wall',
          'Let your arms hang naturally when your back leaves the wall',
          'Add a slight knee flex',
          'Hold this position for 20 seconds. Repeat 5 times.'
        ],
        poseTargets: {
          hipAngle: { min: 35, max: 50, label: 'Hip hinge angle' },
          kneeAngle: { min: 155, max: 175, label: 'Knee flex' },
          spineAngle: { min: 160, max: 180, label: 'Spine straightness' }
        }
      },
      {
        name: 'Balance Check',
        duration: 90,
        description: 'In your golf stance, have someone push you gently from any direction. You should be stable and balanced.',
        cameraNeeded: true,
        steps: [
          'Take your address position',
          'Rock forward onto your toes, then back to center',
          'Rock back onto your heels, then back to center',
          'Find the point where you feel most balanced',
          'Your weight should be on the balls of your feet',
          'Hold this balanced position for 30 seconds'
        ],
        poseTargets: {
          hipAngle: { min: 35, max: 50, label: 'Hip hinge' },
          shoulderLevel: { min: -3, max: 3, label: 'Shoulders level (degrees)' }
        }
      },
      {
        name: 'Alignment Sticks',
        duration: 90,
        description: 'Practice setting up square to your target line. Feet, hips, and shoulders should all be parallel to the target line.',
        cameraNeeded: true,
        steps: [
          'Place a club on the ground aimed at your target',
          'Set your toes along a parallel line',
          'Check that your hips are parallel to the target line',
          'Check that your shoulders are parallel',
          'Hold a club across your shoulders to verify alignment',
          'Step away and re-set 5 times for consistency'
        ],
        poseTargets: {
          shoulderAlignment: { min: -5, max: 5, label: 'Shoulder alignment to target' },
          hipAlignment: { min: -5, max: 5, label: 'Hip alignment to target' }
        }
      }
    ],
    poseChecks: [
      { checkpoint: 'hip_hinge', description: 'Proper hip hinge angle (35-50°)' },
      { checkpoint: 'knee_flex', description: 'Slight knee bend' },
      { checkpoint: 'spine_straight', description: 'Back is straight, not rounded' },
      { checkpoint: 'weight_balanced', description: 'Weight on balls of feet' }
    ]
  },
  {
    id: 3,
    title: 'The Backswing',
    subtitle: 'The First Part of the Swing',
    icon: '🔄',
    color: '#f59e0b',
    summary:
      'Hogan described the backswing as a connected, one-piece movement. The key insight: your hips initiate the backswing by turning, your shoulders follow, and your arms and hands go along for the ride. The famous "pane of glass" concept — your swing should stay on a tilted plane.',
    keyPoints: [
      'The takeaway is a one-piece movement — hands, arms, shoulders move together',
      'Your left arm stays straight (not rigid) throughout the backswing',
      'Hips turn about 45 degrees, shoulders about 90 degrees',
      'This differential creates the "coil" that powers your swing',
      'Your weight shifts to the inside of your right foot',
      'At the top, the club shaft should point roughly at the target'
    ],
    drills: [
      {
        name: 'One-Piece Takeaway',
        duration: 120,
        description: 'Place a club across your chest and turn. Feel your shoulders and hips working together with the shoulders turning more.',
        cameraNeeded: true,
        steps: [
          'Take your address position',
          'Start the backswing by turning your left shoulder toward your chin',
          'Keep your hands, arms, and shoulders moving as one unit',
          'Stop when your hands reach hip height',
          'Check: club shaft should be parallel to your target line',
          'Repeat this half-backswing 15 times slowly'
        ],
        poseTargets: {
          shoulderTurn: { min: 30, max: 50, label: 'Shoulder rotation at half-way' },
          leftArmStraight: { min: 165, max: 180, label: 'Left arm extension' }
        }
      },
      {
        name: 'Full Turn Drill',
        duration: 120,
        description: 'Make full backswings in slow motion, pausing at the top to check your positions.',
        cameraNeeded: true,
        steps: [
          'Take your address position with a mid-iron',
          'Make a slow backswing to the top',
          'Pause and check: left arm straight, right elbow pointing down',
          'Your back should face the target',
          'Weight on inside of right foot — not swaying',
          'Hold the top position for 3 seconds, repeat 10 times'
        ],
        poseTargets: {
          shoulderTurn: { min: 80, max: 100, label: 'Full shoulder turn' },
          hipTurn: { min: 35, max: 55, label: 'Hip rotation' },
          leftArmStraight: { min: 160, max: 180, label: 'Left arm extension' }
        }
      },
      {
        name: 'Coil Resistance Drill',
        duration: 60,
        description: 'Turn your shoulders while keeping your lower body as still as possible. Feel the tension in your core — that is stored power.',
        cameraNeeded: true,
        steps: [
          'Address position with feet firmly planted',
          'Turn only your shoulders — resist with your hips',
          'Feel the stretch in your left side and core',
          'This tension is the "coil" Hogan describes',
          'Hold the stretched position for 5 seconds',
          'Release slowly. Repeat 8 times.'
        ],
        poseTargets: {
          shoulderTurn: { min: 60, max: 90, label: 'Shoulder turn' },
          hipTurn: { min: 15, max: 35, label: 'Hip restriction' }
        }
      }
    ],
    poseChecks: [
      { checkpoint: 'shoulder_turn_90', description: 'Shoulders rotated ~90°' },
      { checkpoint: 'hip_turn_45', description: 'Hips rotated ~45°' },
      { checkpoint: 'left_arm_straight', description: 'Left arm extended, not bent' },
      { checkpoint: 'weight_right_foot', description: 'Weight on inside of right foot' }
    ]
  },
  {
    id: 4,
    title: 'The Downswing',
    subtitle: 'The Second Part of the Swing',
    icon: '⚡',
    color: '#ef4444',
    summary:
      'Hogan\'s most important insight: the downswing is initiated by the HIPS, not the hands or arms. The hips bump slightly toward the target, then rotate open. This pulls everything else through in the correct sequence. Most amateurs do the opposite — they start with their hands.',
    keyPoints: [
      'The downswing starts from the ground up: hips first, then shoulders, then arms, then hands',
      'First move: a slight lateral bump of the hips toward the target',
      'Then the hips rotate open (clear) — this pulls your arms down',
      'Your hands and club naturally drop into the "slot"',
      'Impact: hips open 30-40°, shoulders nearly square, hands ahead of the ball',
      'This sequence is what creates lag and clubhead speed'
    ],
    drills: [
      {
        name: 'Hip Bump Drill',
        duration: 120,
        description: 'From the top of your backswing, practice the initial hip bump toward the target before rotating.',
        cameraNeeded: true,
        steps: [
          'Take your backswing to the top position',
          'Without moving your upper body, shift your hips 2-3 inches toward the target',
          'Feel your weight move to your left foot',
          'Now rotate your hips open',
          'Your arms should drop naturally — DO NOT pull them down',
          'Repeat this bump-and-turn 15 times in slow motion'
        ],
        poseTargets: {
          hipShift: { min: 2, max: 4, label: 'Lateral hip shift (inches)' },
          hipRotation: { min: 30, max: 50, label: 'Hip open at impact' }
        }
      },
      {
        name: 'Step-Through Drill',
        duration: 90,
        description: 'Make swings where you step toward the target with your left foot to start the downswing. This forces the lower body to lead.',
        cameraNeeded: true,
        steps: [
          'Take your backswing — lift your left foot slightly off the ground',
          'Start the downswing by planting your left foot',
          'This forces your lower body to initiate the downswing',
          'Let your arms follow naturally',
          'Finish in a balanced position',
          'Repeat 10 times, gradually making the step smaller'
        ],
        poseTargets: {
          weightShift: { min: 70, max: 90, label: 'Weight on front foot at finish (%)' }
        }
      },
      {
        name: 'Slow Motion Full Swing',
        duration: 90,
        description: 'Make the slowest possible full swing — so slow you can feel every position. Focus on the hip-first sequence.',
        cameraNeeded: true,
        steps: [
          'Set up to an imaginary ball',
          'Take 10 seconds for the backswing',
          'Pause 2 seconds at the top',
          'Take 10 seconds for the downswing — HIPS FIRST',
          'Feel: hips bump, hips rotate, shoulders follow, arms drop, hands release',
          'Repeat 5 ultra-slow-motion swings'
        ],
        poseTargets: {
          sequenceCorrect: { label: 'Hip-shoulder-arms sequence' },
          finishBalance: { label: 'Balanced finish position' }
        }
      }
    ],
    poseChecks: [
      { checkpoint: 'hips_lead', description: 'Hips initiate downswing before shoulders' },
      { checkpoint: 'hip_bump', description: 'Slight lateral hip shift toward target' },
      { checkpoint: 'lag_maintained', description: 'Wrist angle maintained into downswing' },
      { checkpoint: 'weight_forward', description: '80%+ weight on front foot at finish' }
    ]
  },
  {
    id: 5,
    title: 'Putting It Together',
    subtitle: 'Summary & Review',
    icon: '🏌️',
    color: '#8b5cf6',
    summary:
      'Hogan\'s final lesson ties everything together into one fluid motion. The connected swing: proper grip feeds into proper stance, which enables the correct backswing, which sets up the powerful hip-initiated downswing. Practice the whole chain.',
    keyPoints: [
      'Every fundamental builds on the previous one',
      'The grip controls the clubface',
      'Stance and posture set the swing plane',
      'The backswing creates the coil',
      'The downswing releases the stored energy',
      'A repeating swing comes from repeating fundamentals'
    ],
    drills: [
      {
        name: 'Pre-Shot Routine',
        duration: 120,
        description: 'Build a consistent pre-shot routine that checks each fundamental before every swing.',
        cameraNeeded: true,
        steps: [
          'Step 1: Set your grip — check the Vs, check pressure',
          'Step 2: Align to target — feet, hips, shoulders parallel',
          'Step 3: Set your posture — hip hinge, knee flex, arms hanging',
          'Step 4: One waggle to feel the clubhead',
          'Step 5: Look at the target, look at the ball, swing',
          'Repeat this full routine 10 times — make it automatic'
        ],
        poseTargets: {
          fullSetup: { label: 'Complete address position check' }
        }
      },
      {
        name: '9-Shot Drill',
        duration: 120,
        description: 'Make 9 swings: 3 at half-speed focusing on grip, 3 at 3/4 speed focusing on turn, 3 at full speed putting it all together.',
        cameraNeeded: true,
        steps: [
          'Swings 1-3: Half speed, focus entirely on grip and setup',
          'Swings 4-6: Three-quarter speed, focus on full shoulder turn',
          'Swings 7-9: Full speed, focus on hip-initiated downswing',
          'After each swing, hold your finish for 3 seconds',
          'Rate each swing 1-10 in your mind',
          'Identify which fundamental needs the most work'
        ],
        poseTargets: {
          fullSwing: { label: 'Complete swing sequence analysis' }
        }
      },
      {
        name: 'Mirror Check',
        duration: 60,
        description: 'Use the camera as a mirror. Slowly move through each position and check against Hogan\'s fundamentals.',
        cameraNeeded: true,
        steps: [
          'Face the camera in your address position',
          'Check grip, stance width, posture',
          'Slowly take the club to the top — check positions',
          'Slowly bring it to impact — hips open, hands ahead',
          'Finish in a balanced follow-through',
          'Compare your positions to the reference images'
        ],
        poseTargets: {
          fullSequence: { label: 'All positions check' }
        }
      }
    ],
    poseChecks: [
      { checkpoint: 'full_routine', description: 'Consistent pre-shot routine' },
      { checkpoint: 'connected_swing', description: 'All fundamentals flow together' },
      { checkpoint: 'balanced_finish', description: 'Hold finish position 3+ seconds' }
    ]
  }
]

// Recommended progression: spend ~1 week on each lesson before moving to the next.
// But always warm up with Lesson 1 (grip check) and Lesson 2 (stance check).
export const weeklyPlan = [
  { week: 1, focus: 1, warmup: [], description: 'Master the grip — this is your foundation' },
  { week: 2, focus: 2, warmup: [1], description: 'Build your athletic stance and posture' },
  { week: 3, focus: 3, warmup: [1, 2], description: 'Learn the connected backswing' },
  { week: 4, focus: 4, warmup: [1, 2], description: 'Master the hip-initiated downswing' },
  { week: 5, focus: 5, warmup: [1, 2], description: 'Put it all together into one fluid motion' },
  { week: 6, focus: 1, warmup: [], description: 'Review cycle — revisit and refine the grip' }
]

export const SESSION_DURATION = 10 * 60 // 10 minutes in seconds
