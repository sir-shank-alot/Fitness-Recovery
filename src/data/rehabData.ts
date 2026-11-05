import {
  AthleteProfile,
  Exercise,
  PlanWeek,
  FitnessSyncService,
  DailyLog,
  AssessmentResult,
  AthleteId,
} from '../types/rehab';
import { ARWEL_12_WEEK_PLAN } from './arwelPlan';
import { HELEN_12_WEEK_PLAN } from './helenPlan';

export const ATHLETE_PROFILES: Record<string, AthleteProfile> = {
  arwel: {
    id: 'arwel',
    name: 'Arwel Thomas',
    gender: 'Male',
    age: 63,
    weightKg: 71,
    raceCompleted: 'Auckland Marathon 2024 / Recent Finisher',
    avatarColor: '#2563eb', // blue
    keyContraindicationNotice:
      'Avoid lumbar hyperextension, prolonged passive standing arching, and heavy high-velocity kicking. Protect the right knee from deep shear angles.',
    targetGaitCue:
      'Lean slightly from the ankles (forward trunk angle of 4-6°), engage anterior lower abs to prevent lordotic sway, and actively pull right knee up with dorsiflexed foot.',
    injuries: [
      {
        id: 'arwel-adductor',
        title: 'Right Adductor Strain & Swing-Phase Toe Scuffing',
        category: 'Muscle Strain / Gait Impairment',
        anatomicalSite: 'Right Adductor Longus & Brevis',
        clinicalExplanation:
          'The adductor longus acts as a primary hip flexor from hyperextension into early swing. Strain and neuromuscular inhibition prevent adequate hip flexion, leading to delayed foot pickup and ground scuffing with the right toe.',
        contraindications: [
          'High-speed ballistic adductor kicks',
          'Overstriding on downhill descents',
          'Sudden lateral cutting without warm-up',
        ],
        rehabFocus: [
          'Isometric adductor ball squeeze at 45° and 0° hip flexion',
          'Psoas-adductor synergy marching with active dorsiflexion',
          'Progressive Copenhagen plank regressions',
          'Tibialis anterior toe elevation drills',
        ],
        recommendedDrills: [
          'Supine Hip Flexor Psoas March',
          'Copenhagen Adductor Bridge (Bent Knee)',
          'Isometric Adductor Squeeze with Pilates Ball',
          'Tibialis Wall Lean Raise',
        ],
      },
      {
        id: 'arwel-lumbar-facet',
        title: 'Lumbar Facet Joint Irritation & Extension Overload',
        category: 'Spinal / Joint',
        anatomicalSite: 'L4-L5 / L5-S1 Facet Articulations & Thoracolumbar Fascia',
        clinicalExplanation:
          'Running with an overly upright, hyperextended trunk causes repetitive posterior column impaction and facet joint pinching. Compounded by anterior pelvic tilt and fatigue.',
        contraindications: [
          'Prone Roman chair back hyperextensions',
          'Standing cobra hyperextensions with straight legs',
          'Over-upright backward-leaning running stance',
        ],
        rehabFocus: [
          'McGill Big 3 (Modified Curl-up, Side Bridge, Bird Dog)',
          'Dead bug with anti-extension ribcage depression',
          'Posterior pelvic tilt re-education in quadruped and standing',
          'Latissimus & hip flexor release to unload lumbar spine',
        ],
        recommendedDrills: [
          'McGill Curl-Up (One Knee Bent)',
          'Dead Bug Rib-Down Anti-Extension',
          'Bird Dog with Neutral Spine (No Arching)',
          'Cat-Cow Segmental Spinal Articulation',
        ],
      },
      {
        id: 'arwel-itb',
        title: 'Post-Race Bilateral IT Band Stiffening',
        category: 'Fascial / Lateral Chain',
        anatomicalSite: 'Iliotibial Band & Tensor Fasciae Latae (TFL)',
        clinicalExplanation:
          'IT band friction and tension are secondary to fatigue in the gluteus medius and overuse of the TFL to stabilize pelvic drop in the latter 15km of the marathon.',
        contraindications: [
          'Aggressively rolling a hard foam roller directly onto the lateral knee condyle',
          'Crossed-over running gait (narrow step width)',
        ],
        rehabFocus: [
          'Foam rolling TFL and gluteus maximus belly (not the ITB tendon)',
          'Gluteus medius isometric activation to stabilize pelvis',
          'Hip internal and external rotational mobility',
        ],
        recommendedDrills: [
          'TFL & Glute Foam Roll Release',
          'Side-Lying Hip Abduction (Slight Extension)',
          '90-90 Hip Rotational Flow',
        ],
      },
      {
        id: 'arwel-knee-oa',
        title: 'Right Knee Arthritic Discomfort (Monitored)',
        category: 'Degenerative Joint Disease',
        anatomicalSite: 'Right Tibiofemoral & Patellofemoral Joint',
        clinicalExplanation:
          'Mild degenerative change; tolerated the marathon well but requires progressive closed-kinetic-chain quadriceps strength without excessive anterior shear.',
        contraindications: [
          'Seated open-chain heavy leg extensions at end-range flexion',
          'Deep loaded squats past 90° during flare-ups',
        ],
        rehabFocus: [
          'Terminal Knee Extensions (TKE) with resistance loop',
          'Spanish Squats with strap behind knee joint line',
          'Hamstring-quad balanced co-contraction',
        ],
        recommendedDrills: [
          'Banded Terminal Knee Extension (TKE)',
          'Spanish Squat Isometric Hold',
          'Glute Bridge with Knees at 90°',
        ],
      },
    ],
  },
  helen: {
    id: 'helen',
    name: 'Helen Shanley',
    gender: 'Female',
    age: 58,
    weightKg: 59,
    raceCompleted: 'Auckland Marathon 2024 / Recent Finisher',
    avatarColor: '#10b981', // emerald
    keyContraindicationNotice:
      'Strictly avoid ITB stretching into adduction (crossing leg across midline), sitting cross-legged, and direct heavy gripping on dumbbells that strains fingers and thumbs.',
    targetGaitCue:
      'Widen step width slightly (avoid walking or running on a tightrope), cue gentle midfoot loading without slapping, and keep cadence at 170+ spm to reduce peak hip adduction torque.',
    injuries: [
      {
        id: 'helen-plantar',
        title: 'Intermittent Plantar Fasciitis',
        category: 'Tendinopathy / Fascial Overload',
        anatomicalSite: 'Plantar Aponeurosis & Medial Calcaneal Tubercle',
        clinicalExplanation:
          'Repetitive tensile strain on the plantar fascia insertional fibers from 42km of road pounding. Symptoms spike on first morning steps as the shortened contracted fascia is abruptly placed under load.',
        contraindications: [
          'Walking barefoot on hard wooden or tile floors upon waking',
          'Aggressive heel-strike walking without supportive arch cushioning',
          'High-impact jumping before warm-up',
        ],
        rehabFocus: [
          'Rathleff Protocol: high-load eccentric calf raise with rolled towel under toes',
          'Soleus bent-knee calf loading',
          'Plantar fascia manual cross-friction and frozen water bottle roll',
          'Intrinsic foot toe-doming (short foot exercise)',
        ],
        recommendedDrills: [
          'Rathleff Protocol Towel Calf Raise',
          'Seated Bent-Knee Soleus Raise',
          'Short Foot Intrinsic Doming',
          'Great Toe Extension Stretch',
        ],
      },
      {
        id: 'helen-gtps',
        title: 'Greater Trochanteric Pain Syndrome (GTPS / Gluteal Tendinopathy)',
        category: 'Tendinopathy / Compressive Overuse',
        anatomicalSite: 'Gluteus Medius & Minimus Tendon Insertion at Greater Trochanter',
        clinicalExplanation:
          'Compressive mechanical loading of the gluteus medius tendon over the trochanteric prominence. Often triggered by excessive hip adduction, pelvic drop (Trendelenburg), or crossing legs.',
        contraindications: [
          'ITB / Piriformis crossed-leg adduction stretches (compresses the tendon)',
          'Sleeping on affected side without a pillow between knees',
          'Standing hanging on one hip (hip drop stance)',
        ],
        rehabFocus: [
          'Isometric hip abduction (standing wall press / side-lying with pillow)',
          'Pelvic drop re-education (step-downs without hip drop)',
          'Strengthening gluteus medius within 0-15° of abduction (never into adduction)',
        ],
        recommendedDrills: [
          'Isometric Hip Abduction Wall Press',
          'Neutral Clamshell with Block (No Adduction)',
          'Banded Monster Walk at Shins',
          'Pelvic Drop / Lateral Step Down',
        ],
      },
      {
        id: 'helen-perimenopause-joints',
        title: 'Multi-Joint Inflammation (Fingers, Thumbs, Wrists, Elbows)',
        category: 'Systemic / Hormonal Arthralgia',
        anatomicalSite: 'Bilateral MCP/IP Finger Joints, CMC Thumb, Wrist Extensors, Common Extensor Tendon',
        clinicalExplanation:
          'Fluctuating and declining estrogen levels during perimenopause decrease joint lubrication and heighten inflammatory response in small joint synovial linings. Gripping standard dumbbells causes wrist and thumb shear.',
        contraindications: [
          'Heavy dumbbell farmer carries or thick barbell deadlifts with tight hand grip',
          'Loaded push-ups with wrists bent back at 90° hyperextension',
          'Repetitive wrist extension wringing motions',
        ],
        rehabFocus: [
          'Grip-free strength loading: loop bands around forearms instead of hands',
          'Neutral-wrist push-up handles or fist placement',
          'Wrist and finger gentle joint fluid mobility & tendon glides',
          'Systemic recovery pacing, anti-inflammatory hydration, warm-soak prep',
        ],
        recommendedDrills: [
          'Forearm Loop Band Upper Pull-Apart (Grip-Free)',
          'Fist-Supported or Forearm Incline Plank',
          'Finger & Tendon Gliding Sequence',
          'Elbow Eccentric Extensor Slide (Loop Supported)',
        ],
      },
    ],
  },
};

export const EXERCISE_LIBRARY: Exercise[] = [
  // --- SPINE & CORE (McGill Big 3 & Anti-Extension) ---
  {
    id: 'mcgill-curlup',
    name: 'McGill Modified Curl-Up',
    category: 'Spine & Core',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Lumbar Facet Overload', 'Chronic Back Pain', 'Core Instability'],
    equipment: 'Exercise Mat',
    defaultSets: 3,
    defaultReps: '6-4-2 pyramid holds (10s hold each)',
    frequency: '4x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=uzMYRO05kJw',
    videoEmbedId: 'uzMYRO05kJw',
    videoChannel: 'Dr. Stuart McGill / BackFitPro / Squat University',
    rationale:
      'Spares the lumbar spine by maintaining neutral lordosis with hands placed under the lower back, while activating the rectus abdominis and obliques without spinal flexion shear.',
    techniqueCues: [
      'Lie supine: one leg bent with foot flat, one leg extended flat on floor',
      'Place both hands palms-down underneath the natural lumbar arch to monitor neutral spine',
      'Brace abdominal wall as if preparing to take a punch (do not hollow or suck in)',
      'Lift head and upper shoulders off floor as a single unit only 1-2 inches',
      'Hold for 7-10 seconds while breathing normally through your braced core',
    ],
    commonMistakes: [
      'Tucking the chin to the chest aggressively (keep neck neutral)',
      'Flattening the lower back into the floor (keep natural lumbar curve supported by hands)',
    ],
    jointFriendlyModification:
      'Keep head in line with cervical spine; rest elbows comfortably on floor to avoid neck tension.',
    safetyNotes: 'Stop if you feel sharp pain in the lower back or neck. Focus on abdominal stiffness.',
  },
  {
    id: 'mcgill-side-bridge',
    name: 'McGill Side Bridge (Knee or Full Lever)',
    category: 'Spine & Core',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Lumbar Facet Overload', 'Quadratus Lumborum Weakness', 'GTPS'],
    equipment: 'Exercise Mat',
    defaultSets: 3,
    defaultReps: '5 reps of 10s holds per side',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=DICb29SKTaM',
    videoEmbedId: 'DICb29SKTaM',
    videoChannel: 'Dr. Stuart McGill / BackFitPro',
    rationale:
      'Chairs high lateral core and quadratus lumborum stiffness with minimal compressive spinal load, stabilizing the pelvis during the running stance phase.',
    techniqueCues: [
      'Begin on your side, supporting upper body on elbow placed directly beneath shoulder',
      'Bend knees at 90° (regressed) or stack feet (advanced)',
      'Bridge hips forward and up until torso and thighs form a straight alignment',
      'Top hand rests on opposite shoulder or hip',
      'Hold 10 seconds, lower gently, and repeat in descending pyramid (4, 3, 2 reps)',
    ],
    commonMistakes: [
      'Sagging hips or rotating shoulders forward toward the floor',
      'Holding your breath during the 10-second hold',
    ],
    jointFriendlyModification:
      'Helen: Perform with knees bent at 90° on the floor to reduce shoulder/elbow load; rest forearm on a cushioned pad.',
    safetyNotes: 'Keep cervical spine in neutral alignment with your thoracic spine.',
  },
  {
    id: 'mcgill-bird-dog',
    name: 'McGill Bird Dog (Neutral Anti-Extension)',
    category: 'Spine & Core',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Lumbar Facet Joint Irritation', 'Posterior Chain Timing', 'Pelvic Stability'],
    equipment: 'Exercise Mat',
    defaultSets: 3,
    defaultReps: '5 reps of 8s hold per diagonal',
    frequency: '4x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=S1QbyYZaXIg',
    videoEmbedId: 'S1QbyYZaXIg',
    videoChannel: 'Dr. Stuart McGill / Squat University',
    rationale:
      'Activates erector spinae, multifidus, and gluteus maximus simultaneously without placing the lumbar spine into extension or rotational strain.',
    techniqueCues: [
      'Quadruped position on hands and knees: wrists under shoulders, knees under hips',
      'Lock lumbar spine in neutral; lock abdominal brace',
      'Simultaneously reach one arm forward and opposite leg backward parallel to the floor',
      'Make a loose fist with the reaching hand; push the back heel back (do not kick high into back arch)',
      'Hold for 6-8 seconds, return lightly without touching down, or sweep square to floor',
    ],
    commonMistakes: [
      'Lifting leg higher than hip level and hyperextending the lower back (Arwel: key trigger!)',
      'Tilting or rotating the pelvis to one side',
    ],
    jointFriendlyModification:
      'Helen: If wrists ache on floor, rest on fists or place forearms on a low bench/foam block.',
    safetyNotes: 'Zero spinal motion during the limb reach is the primary goal.',
  },
  {
    id: 'dead-bug-anti-extension',
    name: 'Dead Bug with Rib-Down Core Engagement',
    category: 'Spine & Core',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Lumbar Extension Overload', 'Excessive Anterior Pelvic Tilt', 'Adductor Strain'],
    equipment: 'Exercise Mat',
    defaultSets: 3,
    defaultReps: '10 alternating reps (5 per side)',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=o4GKiEoYClI',
    videoEmbedId: 'o4GKiEoYClI',
    videoChannel: 'Pursuit Physical Therapy / Core Stability',
    rationale:
      'Retrains the deep anterior core (transverse abdominis & internal obliques) to resist lumbar hyperextension when the legs reach out, directly countering Arwel’s upright running posture.',
    techniqueCues: [
      'Lie on back with knees bent at 90° above hips, arms reaching straight toward ceiling',
      'Exhale deeply through mouth, drawing ribcage down flush toward pelvis',
      'Maintain ribcage connection while slowly extending right arm overhead and left heel down toward floor',
      'Only lower as far as you can maintain your back in neutral without arching',
      'Inhale return to center, and repeat on opposite diagonal',
    ],
    commonMistakes: [
      'Allowing lower back to peel off the mat as the heel approaches floor',
      'Flaring ribs upward toward ceiling',
    ],
    jointFriendlyModification:
      'Tap toe on floor with knee bent 90° if full leg reach causes lower back to pull.',
    safetyNotes: 'If lower back pinches, reduce the range of leg extension immediately.',
  },

  // --- ADDUCTOR & PELVIS (Arwel & Helen) ---
  {
    id: 'adductor-ball-squeeze',
    name: 'Isometric Adductor Squeeze with Ball (Double & Single Angle)',
    category: 'Adductor & Pelvis',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Right Adductor Strain', 'Pubic Symphysis Stability', 'Pelvic Ring Control'],
    equipment: 'Small Pilates Ball, Foam Yoga Block, or Rolled Towel',
    defaultSets: 4,
    defaultReps: '5 reps of 10s isometric squeeze at 70% effort',
    frequency: '4x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=pNsiAiFLF68',
    videoEmbedId: 'pNsiAiFLF68',
    videoChannel: 'Sports Groin Protocol / Physiotutors',
    rationale:
      'Isometric adductor loading stimulates collagen synthesis and restores neuromuscular recruitment in the adductor longus without tendon elongation shear.',
    techniqueCues: [
      'Lie supine with knees bent at 45°, feet flat and hip-width apart',
      'Place a 6-8 inch pilates ball or foam block securely between knees',
      'Gently brace core, then smoothly squeeze knees inward against the ball to 50-70% max effort',
      'Hold steady for 10 seconds while breathing smoothly',
      'Slowly release tension over 3 seconds; rest 10 seconds before next rep',
    ],
    commonMistakes: [
      'Squeezing at 100% maximum explosive force on an injured tendon',
      'Arching lower back while squeezing',
    ],
    jointFriendlyModification:
      'Keep effort pain-free (VAS <= 2/10). Arwel: if right adductor twinges, reduce compression to 40%.',
    safetyNotes: 'Do not bounce or pulse. Pure smooth isometric holds only.',
  },
  {
    id: 'copenhagen-plank-bent-knee',
    name: 'Copenhagen Adductor Bridge (Bent-Knee Lever Regression)',
    category: 'Adductor & Pelvis',
    targetAthletes: ['arwel'],
    targetConditions: ['Right Adductor Strain', 'Swing Phase Hip Adductor Strength'],
    equipment: 'Sturdy Couch, Workout Bench, or Chair with Towel',
    defaultSets: 3,
    defaultReps: '15-20s hold per side',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=CYfcIXEA78s',
    videoEmbedId: 'CYfcIXEA78s',
    videoChannel: 'Physical Therapy & Sports Medicine',
    rationale:
      'Gold-standard rehabilitation exercise for adductor strains. The bent-knee version reduces the lever arm to safely rebuild high eccentric and isometric adductor resilience.',
    techniqueCues: [
      'Side-plank position on forearm, perpendicular to bench/chair',
      'Rest top leg on bench supporting with the inside of the knee and lower thigh (short lever)',
      'Bottom leg is tucked underneath or resting on floor',
      'Lift hips off the floor until body forms a straight line from shoulder to knee',
      'Keep pelvis square to the wall; do not let top hip rotate backward',
      'Progress in Phase 2 to elevating the bottom leg slightly off floor',
    ],
    commonMistakes: [
      'Starting with ankle on the bench (long lever) too early in recovery',
      'Letting hips drop toward the floor or twisting torso',
    ],
    jointFriendlyModification:
      'Keep bottom knee lightly touching floor for assistance if right adductor has residual tenderness.',
    safetyNotes: 'Keep pain below 2/10. Advance to straight leg only in Phase 3.',
  },
  {
    id: 'psoas-adductor-march',
    name: 'Supine Banded Psoas & Adductor March with Toe Dorsiflexion',
    category: 'Adductor & Pelvis',
    targetAthletes: ['arwel'],
    targetConditions: ['Toe Scuffing on Right Foot', 'Adductor/Hip Flexor Muscle Timing'],
    equipment: 'Light Mini-Band (placed around feet / arches)',
    defaultSets: 3,
    defaultReps: '10 slow controlled reps per side',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=P1LDP4BG9Q4',
    videoEmbedId: 'P1LDP4BG9Q4',
    videoChannel: 'Running Biomechanics & Physical Therapy',
    rationale:
      'Retrains active swing-phase hip flexion coupled with tibialis anterior ankle dorsiflexion, directly preventing Arwel’s right toe scuffing.',
    techniqueCues: [
      'Lie on your back with light resistance loop around the midfoot of both shoes',
      'Start with both hips and knees at 90°',
      'Keep lower back flat in neutral against the mat',
      'Drive right knee toward chest while pulling right toes up hard toward right shin (dorsiflexion)',
      'Opposite leg stays extended or holds steady to anchor band',
      'Pause for 2 seconds at peak flexion, then return under 3-second control',
    ],
    commonMistakes: [
      'Letting the right toe point down (plantarflexion) during the pull (reinforces scuffing)',
      'Arching lower back when opposite leg extends',
    ],
    jointFriendlyModification:
      'Perform without resistance band first in Week 1-2 to master motor control.',
    safetyNotes: 'Emphasize the conscious cue: "Knee high, toes to the sky!"',
  },
  {
    id: 'tibialis-wall-raise',
    name: 'Standing Tibialis Anterior Wall Lean Raise',
    category: 'Foot & Calf',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Toe Scuffing / Foot Drop Mechanics', 'Shin Splints', 'Plantar Load Balance'],
    equipment: 'Flat Wall Surface',
    defaultSets: 3,
    defaultReps: '15-20 controlled reps (3s tempo)',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=pQcvW08rnAk',
    videoEmbedId: 'pQcvW08rnAk',
    videoChannel: 'ATG / Knees Over Toes Guy',
    rationale:
      'Strengthens the tibialis anterior muscle responsible for pulling the forefoot up during the swing phase, eradicating toe drag and ground scuffing.',
    techniqueCues: [
      'Stand with back flat against a wall, feet stepped 12-18 inches forward',
      'Legs straight with knees unlocked (soft micro-bend to protect knee joint)',
      'Flex both ankles backward, pulling toes and balls of feet as high off the floor as possible',
      'Squeeze the front of your shins hard at the top for 1 full second',
      'Lower balls of feet down under control until they barely touch the floor and immediately repeat',
    ],
    commonMistakes: [
      'Bending knees and pushing hips away from the wall',
      'Rushing the lowering phase',
    ],
    jointFriendlyModification:
      'Step closer to the wall to decrease resistance; step farther out to increase loading.',
    safetyNotes: 'Completely zero impact on knee cartilage.',
  },

  // --- HIP & GLUTE (Helen GTPS & Arwel ITB) ---
  {
    id: 'isometric-hip-abduction-wall',
    name: 'Standing Isometric Hip Abduction Wall Press',
    category: 'Hip & Glute (GTPS)',
    targetAthletes: ['helen', 'arwel'],
    targetConditions: ['Greater Trochanteric Pain Syndrome (GTPS)', 'Gluteus Medius Tendinopathy', 'ITB Tension'],
    equipment: 'Smooth Wall & Small Pillow / Foam Pad',
    defaultSets: 4,
    defaultReps: '5 reps of 15-20s holds at 60% effort',
    frequency: '4x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=1xPUiHBZV2E',
    videoEmbedId: '1xPUiHBZV2E',
    videoChannel: 'MedBridge / Physical Therapy',
    rationale:
      'Evidence-based first-line treatment for gluteal tendinopathy. Delivers an analgesic effect to the gluteus medius/minimus without tendon compression over the trochanter.',
    techniqueCues: [
      'Stand parallel to a wall, feet hip-width apart',
      'Outside standing leg is the working stabilizing leg (standing tall, knee soft)',
      'Bend inside knee to 90° and place a soft cushion between inside knee and wall',
      'Press inside knee horizontally into the wall, activating both the wall glute and the stance leg glute',
      'Keep pelvis completely level; do not hitch hip or lean torso away',
      'Hold steady for 15-20 seconds while breathing normally',
    ],
    commonMistakes: [
      'Leaning the upper body towards or away from the wall to cheat',
      'Pushing through the foot instead of the lateral knee',
    ],
    jointFriendlyModification:
      'Helen: Keep stance leg foot firmly planted and track knee over second toe; avoid dropping pelvis.',
    safetyNotes: 'Never push to the point of sharp lateral hip ache.',
  },
  {
    id: 'neutral-clamshell-cushioned',
    name: 'Modified Neutral Clamshell (With Pillow / No Adduction)',
    category: 'Hip & Glute (GTPS)',
    targetAthletes: ['helen'],
    targetConditions: ['GTPS / Lateral Hip Pain', 'Pelvic Stability in Running'],
    equipment: 'Exercise Mat & 4-inch Yoga Block or Folded Towel',
    defaultSets: 3,
    defaultReps: '12-15 slow reps per side',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=aQVApsdOLSI',
    videoEmbedId: 'aQVApsdOLSI',
    videoChannel: 'Physical Therapy Clinical Rehab',
    rationale:
      'Traditional clamshells allow the knee to cross into adduction at the bottom, squashing the glute tendon. Using a spacer block keeps the hip in neutral, loading the gluteus medius cleanly.',
    techniqueCues: [
      'Lie on unaffected side with hips bent at 45° and knees at 90°',
      'Place a 4-inch foam block or folded towel between knees so top knee NEVER drops into adduction',
      'Keep heels glued together and pelvis rolled slightly forward (30° toward mat)',
      'Lift top knee 6-8 inches off the block while keeping feet together',
      'Hold for 2 seconds at the top, feeling lateral glute fire, then lower back to block',
    ],
    commonMistakes: [
      'Rolling pelvis backward toward the wall to raise the knee higher',
      'Letting the knees collapse together without the spacer',
    ],
    jointFriendlyModification:
      'Rest head on an outstretched arm or pillow to keep neck and upper spine relaxed.',
    safetyNotes: 'Keep the range small and precise. Quality over height.',
  },
  {
    id: 'banded-monster-walk',
    name: 'Banded Lateral Monster Walk (Shin Placement)',
    category: 'Hip & Glute (GTPS)',
    targetAthletes: ['helen', 'arwel'],
    targetConditions: ['Gluteus Medius / Minimus Weakness', 'Pelvic Drop (Trendelenburg)', 'ITB Balance'],
    equipment: 'Light to Medium Elastic Resistance Loop',
    defaultSets: 3,
    defaultReps: '12 steps left, 12 steps right',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=ESmDtnFmK0o',
    videoEmbedId: 'ESmDtnFmK0o',
    videoChannel: 'Physical Therapy Exercises',
    rationale:
      'Placing the band at mid-shin or above the knees avoids ankle eversion strain while maximizing gluteus medius and tensor balance, preventing dynamic valgus and pelvic dip.',
    techniqueCues: [
      'Place loop band around shins (below knees for Helen to protect GTPS from excessive lever)',
      'Adopt an athletic quarter-squat posture: chest up, hips hinged slightly back, feet pointing straight ahead',
      'Take a controlled lateral step with leading leg, keeping knees pushed out over toes',
      'Follow with trailing leg, maintaining band tension at all times (never let feet touch)',
      'Keep hips level—do not bob up and down like a duck',
    ],
    commonMistakes: [
      'Turning toes outward into a Charlie Chaplin duck walk',
      'Allowing knees to cave inward as trailing foot steps in',
    ],
    jointFriendlyModification:
      'Arwel: Keep squat shallow (20-30° max) to prevent right knee OA discomfort.',
    safetyNotes: 'Maintain tension on the band throughout the entire traverse.',
  },

  // --- FOOT & CALF (Helen Plantar Fascia & Arwel Stride) ---
  {
    id: 'rathleff-plantar-raise',
    name: 'Rathleff Protocol High-Load Heel Raise (Towel Under Toes)',
    category: 'Foot & Calf',
    targetAthletes: ['helen'],
    targetConditions: ['Plantar Fasciitis', 'Achilles Tendon Stiffness', 'Windlass Mechanism'],
    equipment: 'Stair Step or Wooden Block & Rolled Hand Towel',
    defaultSets: 3,
    defaultReps: '8-10 reps (3s up, 2s pause, 3s down) every other day',
    frequency: '3x weekly (Alternate days)',
    videoUrl: 'https://www.youtube.com/watch?v=p8k8xTui7q4',
    videoEmbedId: 'p8k8xTui7q4',
    videoChannel: 'Dr. Michael Rathleff / BJSM Protocol',
    rationale:
      'The premier clinical trial protocol for plantar fasciitis. Elevating the big toe with a rolled towel pre-tensions the plantar fascia via the Windlass mechanism, stimulating collagen alignment and tensile recovery under controlled load.',
    techniqueCues: [
      'Place a rolled hand towel under the toes of the affected foot on the edge of a step',
      'Balls of the feet rest on the step edge; heels hang off freely',
      'Rise up onto toes over a 3-second concentric count',
      'Hold at peak contraction for a full 2-second pause',
      'Lower heel down below step level over a slow 3-second count into a comfortable stretch',
      'Phase 1: Both feet on step. Phase 2: Shift 70% weight to affected foot. Phase 3: Single-leg.',
    ],
    commonMistakes: [
      'Bouncing up and down quickly at the bottom of the stretch',
      'Not using the rolled towel under toes (essential for the Windlass mechanism)',
    ],
    jointFriendlyModification:
      'Perform near a railing or wall to lightly touch with fingertips for balance.',
    safetyNotes: 'A mild discomfort (2-3/10) is normal; sharp or escalating pain indicates reducing load.',
  },
  {
    id: 'bent-knee-soleus-raise',
    name: 'Seated or Wall-Supported Bent-Knee Soleus Raise',
    category: 'Foot & Calf',
    targetAthletes: ['helen', 'arwel'],
    targetConditions: ['Plantar Fascia Load Cushioning', 'Soleus Strength in Distance Running'],
    equipment: 'Chair or Low Wall',
    defaultSets: 3,
    defaultReps: '15-20 reps with 2s pause at top',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=ar8nav0jGoE',
    videoEmbedId: 'ar8nav0jGoE',
    videoChannel: 'Physical Therapy / Soleus Rehab',
    rationale:
      'The soleus absorbs up to 6.5-8 times body weight during marathon running. Bending the knee to 90° slacks the gastrocnemius, isolating soleus endurance to protect the plantar fascia from shock.',
    techniqueCues: [
      'Sit tall on a sturdy chair with knees bent at 90°, feet flat on floor',
      'Press through the balls of both feet to lift heels as high as possible',
      'Hold the peak contraction for 2 seconds, feeling the deep lower calf muscles work',
      'Lower heels slowly to floor over 2 seconds',
      'In Phase 2-3, rest a light backpack or yoga block on thighs for resistance',
    ],
    commonMistakes: [
      'Lifting toes instead of heels',
      'Letting ankles roll outward onto the outer edges of feet',
    ],
    jointFriendlyModification:
      'Completely seated, meaning zero joint impact on knee or hands.',
    safetyNotes: 'Focus on pressing through the base of the first and second metatarsals (big toe mound).',
  },
  {
    id: 'short-foot-intrinsic-doming',
    name: 'Short Foot Intrinsic Muscle Doming (Arch Lift)',
    category: 'Foot & Calf',
    targetAthletes: ['helen', 'arwel'],
    targetConditions: ['Plantar Fasciitis', 'Foot Arch Collapse', 'Toe Scuffing'],
    equipment: 'Flat Floor (Barefoot / Socks)',
    defaultSets: 3,
    defaultReps: '10 reps of 5s holds per foot',
    frequency: 'Daily (Morning Routine)',
    videoUrl: 'https://www.youtube.com/watch?v=7EQ_9LfUYcM',
    videoEmbedId: '7EQ_9LfUYcM',
    videoChannel: 'Orthopaedic Associates of Wisconsin',
    rationale:
      'Strengthens the abductor hallucis and flexor digitorum brevis, building an active muscular arch that unloads passive strain from the plantar fascia during every foot strike.',
    techniqueCues: [
      'Sit or stand barefoot with weight evenly distributed on tripod: heel, base of big toe, base of pinky toe',
      'Without curling or clawing your toes, draw the ball of the big toe backward toward your heel',
      'Watch your medial longitudinal arch visibly lift off the ground',
      'Keep all 5 toes relaxed and long on the floor—do not claw the carpet!',
      'Hold the arch dome for 5 seconds, relax, and repeat',
    ],
    commonMistakes: [
      'Clawing toes into the ground like an eagle talon',
      'Rolling ankle onto the outside of the foot to fake an arch',
    ],
    jointFriendlyModification:
      'Perform seated in a chair first; advance to standing only once the motor pattern is mastered.',
    safetyNotes: 'Zero strain on joints; excellent tactile neuromuscular feedback.',
  },

  // --- KNEE & QUAD (Arwel Osteoarthritis & Helen Stability) ---
  {
    id: 'banded-tke',
    name: 'Terminal Knee Extension (TKE) with Resistance Loop',
    category: 'Knee & Quad',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Right Knee Osteoarthritis', 'Vastus Medialis Oblique (VMO) Activation'],
    equipment: 'Resistance Loop anchored to sturdy table leg or door anchor',
    defaultSets: 3,
    defaultReps: '15 slow reps per leg',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=CU7Fn11YMTw',
    videoEmbedId: 'CU7Fn11YMTw',
    videoChannel: 'Physical Therapy Treatment Tips',
    rationale:
      'Strengthens the terminal 30 degrees of quadriceps extension and VMO without the compressive patellofemoral shear of seated leg extensions, lubricating arthritic knee cartilage.',
    techniqueCues: [
      'Anchor resistance loop at knee height; step right leg into loop with band behind knee joint crease',
      'Step back until band has moderate tension, standing with weight primarily on back leg',
      'Right knee begins slightly unlocked (about 20-30° bend)',
      'Contract right quad and glute to smoothly straighten right knee back against band tension',
      'Squeeze quad hard at terminal lockout for 2 seconds without hyperextending',
      'Control the return forward into slight bend over 2 seconds',
    ],
    commonMistakes: [
      'Hyperextending the knee joint backward aggressively into the joint capsule',
      'Pivoting hips sideways instead of focusing solely on the knee',
    ],
    jointFriendlyModification:
      'Arwel: Keep lockout smooth and controlled, avoiding any jarring snap.',
    safetyNotes: 'Safe for arthritic knees because joint compression is minimal at this shallow angle.',
  },
  {
    id: 'spanish-squat-isometric',
    name: 'Spanish Squat Isometric Hold (Cartilage Friendly)',
    category: 'Knee & Quad',
    targetAthletes: ['arwel'],
    targetConditions: ['Right Knee Arthritic Discomfort', 'Patellar Tendon Resilience'],
    equipment: 'Heavy Resistance Band or Rig Strap anchored behind both knees',
    defaultSets: 3,
    defaultReps: '45s isometric hold at 60° knee bend',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=1CJ3hteGxo4',
    videoEmbedId: '1CJ3hteGxo4',
    videoChannel: 'E3 Rehab - Spanish Squat Technique',
    rationale:
      'By placing the strap behind the popliteal crease, vertical shin angles are maintained, dramatically reducing patellofemoral shear stress while delivering high quadriceps stimulus to support Arwel’s arthritic knee.',
    techniqueCues: [
      'Anchor heavy band around a solid pillar; step both legs through with band behind knees',
      'Walk back until strong tension pulls your shins forward',
      'Sit back into a squat as if sitting into an invisible chair, keeping shins perfectly vertical',
      'Torso remains upright, core braced',
      'Hold at roughly 45-60° knee flexion for 30 to 45 seconds',
      'Push through whole foot to stand tall',
    ],
    commonMistakes: [
      'Allowing knees to track forward past toes (the band should keep shins vertical)',
      'Rounding the lower back',
    ],
    jointFriendlyModification:
      'Adjust squat depth to 30-45° if 60° triggers any knee ache.',
    safetyNotes: 'Provides an immediate analgesic pain-relief window for knee pain.',
  },

  // --- UPPER & GRIP-FREE JOINT-FRIENDLY (Helen Perimenopause Arthralgia) ---
  {
    id: 'forearm-band-pull-apart',
    name: 'Forearm-Loop Band Pull-Apart (Grip-Free Scapular Loading)',
    category: 'Spine & Core',
    targetAthletes: ['helen', 'arwel'],
    targetConditions: ['Perimenopause Hand/Wrist Arthritis', 'Running Posture / Thoracic Extension'],
    equipment: 'Elastic Mini-Loop Band (looped around distal forearms)',
    defaultSets: 3,
    defaultReps: '12-15 reps with 2s hold',
    frequency: '3x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=osRimvxXlKQ',
    videoEmbedId: 'osRimvxXlKQ',
    videoChannel: 'Movement Parallels Life / Functional Shoulder',
    rationale:
      'Restores thoracic spine extension and postural stamina for running without gripping dumbbells or stressing arthritic thumbs, fingers, and wrists.',
    techniqueCues: [
      'Slip mini-loop band over wrists and onto lower forearms',
      'Hands are open with relaxed fingers, thumbs pointing upward (zero grip pressure required)',
      'Arms held out in front at chest height with elbows slightly soft',
      'Squeeze shoulder blades together and pull forearms outward against band until arms reach a wide "T"',
      'Pause for 2 seconds, squeezing between shoulder blades, then slowly return under 3-second control',
    ],
    commonMistakes: [
      'Clenching fists or curling wrists (keep fingers relaxed and palms facing each other)',
      'Shrugging shoulders up toward ears',
    ],
    jointFriendlyModification:
      'Helen: Totally bypasses finger/thumb gripping and CMC thumb joint compression.',
    safetyNotes: 'Keep neck relaxed and collarbones open.',
  },
  {
    id: 'wrist-finger-tendon-glides',
    name: 'Finger & Wrist Tendon Gliding Sequence with Warmth Prep',
    category: 'Mobility & Decompression',
    targetAthletes: ['helen'],
    targetConditions: ['Perimenopause Joint Inflammation', 'Stiff Finger/Thumb/Wrist Joints'],
    equipment: 'Warm Water Basin or Heating Pad (Recommended)',
    defaultSets: 2,
    defaultReps: '5 cycles of 4 hand postures (Straight, Hook, Flat Fist, Full Fist)',
    frequency: 'Daily (Morning or Evening)',
    videoUrl: 'https://www.youtube.com/watch?v=EZfceM-1x5Q',
    videoEmbedId: 'EZfceM-1x5Q',
    videoChannel: 'Ask Doctor Jo / Hand & Finger Exercises',
    rationale:
      'Promotes synovial fluid circulation, unglues flexor tendons, and reduces morning thumb and finger stiffness triggered by perimenopausal hormonal shifts.',
    techniqueCues: [
      'Soak hands in warm water or apply warm towel for 2 minutes prior to start',
      'Start with hand straight, fingers together pointing up',
      'Position 1: Hook fist (bend MCP/PIP joints, tips touch top of palm)',
      'Position 2: Flat fist (bend knuckles 90°, fingers straight)',
      'Position 3: Full closed fist with thumb wrapping gently over outside (no hard squeeze)',
      'Hold each position 3 seconds smoothly; perform 5 gentle cycles per hand',
    ],
    commonMistakes: [
      'Forcefully squeezing the fist tight',
      'Moving quickly through the transitions',
    ],
    jointFriendlyModification:
      'Never force a painful range; move within a warm, comfortable margin.',
    safetyNotes: 'Helps dispel joint fluid pooling and morning finger puffiness.',
  },

  // --- MOBILITY & DECOMPRESSION (Spine, Hips & ITB) ---
  {
    id: 'hip-flexor-tuck-stretch',
    name: 'Half-Kneeling Posterior Pelvic Tilt Hip Flexor Stretch',
    category: 'Mobility & Decompression',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Lumbar Facet Joint Overload', 'Excessive Anterior Tilt', 'ITB & Hip Tightness'],
    equipment: 'Exercise Mat & Foam Cushion under back knee',
    defaultSets: 3,
    defaultReps: '30s hold per side (3 deep breath cycles)',
    frequency: 'Daily',
    videoUrl: 'https://www.youtube.com/watch?v=SDsjnuCf90U',
    videoEmbedId: 'SDsjnuCf90U',
    videoChannel: 'Squat University / Pelvic Tilt Hip Stretch',
    rationale:
      'Traditional hip flexor stretches hyperextend the lumbar spine, aggravating Arwel’s facet joints. By actively posterior tilting (tucking the tailbone under) and squeezing the glute, the psoas and rectus femoris are lengthened without spinal compression.',
    techniqueCues: [
      'Half-kneeling position: front foot flat at 90°, back knee rested on a thick soft cushion',
      'Maintain an upright torso—do NOT lunge forward or arch your lower back!',
      'Perform a posterior pelvic tilt: tuck tailbone under as if tucking belt buckle up toward nose',
      'Squeeze the glute of the kneeling leg hard; feel an intense, targeted stretch in front of the hip/thigh',
      'Gently raise the arm on the kneeling side toward ceiling and reach slightly across body',
      'Breathe deeply into diaphragm for 30 seconds',
    ],
    commonMistakes: [
      'Slumping pelvis forward into an arched lumbar backbend (destroys the stretch and hurts facets)',
      'Not squeezing the trailing glute',
    ],
    jointFriendlyModification:
      'Arwel: Keep back knee on a 2-inch foam block to protect knee OA from hard floor pressure.',
    safetyNotes: 'Pain-free, soothing tension release in anterior hip.',
  },
  {
    id: 'cat-cow-segmental',
    name: 'Segmental Cat-Cow Spinal Wave (Neutral Focus)',
    category: 'Mobility & Decompression',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Chronic Back Pain', 'Thoracolumbar Stiffness', 'Facet Joint Decompression'],
    equipment: 'Exercise Mat',
    defaultSets: 2,
    defaultReps: '8 slow segmental waves (5s each)',
    frequency: 'Daily (Morning Routine)',
    videoUrl: 'https://www.youtube.com/watch?v=FyCuSE3mDcc',
    videoEmbedId: 'FyCuSE3mDcc',
    videoChannel: 'Physiotutors / Segmental Spine Mobility',
    rationale:
      'Gentle passive spinal motion restores intervertebral disc hydration and relieves facet capsule constriction. Emphasizes segmental control through the thoracic and lumbar spine.',
    techniqueCues: [
      'Quadruped position on hands and knees with neutral spine',
      'Begin the movement strictly from the pelvis: tuck tailbone, then round lower back, mid-back, and finally drop head into gentle Cat flexion',
      'Reverse from pelvis: gently untuck tailbone, ripple through mid-back into modest extension',
      'Arwel: Limit the "Cow" extension range to neutral or mild extension—do NOT crank the lower back into deep lordosis',
      'Sync with breath: inhale during gentle extension, exhale during rounded flexion',
    ],
    commonMistakes: [
      'Hyperextending the lower back into painful pinching at the bottom',
      'Moving as a rigid block rather than vertebra-by-vertebra',
    ],
    jointFriendlyModification:
      'Helen: Rest on fists or yoga blocks to keep wrists straight and comfortable.',
    safetyNotes: 'Keep movement smooth, fluid, and strictly pain-free.',
  },
  {
    id: 'tfl-glute-release',
    name: 'Targeted TFL & Gluteal Myofascial Foam Roller Release',
    category: 'Mobility & Decompression',
    targetAthletes: ['arwel', 'helen'],
    targetConditions: ['Post-Marathon ITB Stiffening', 'Gluteal Tension', 'Hip Tightness'],
    equipment: 'Medium Density Foam Roller or Massage Ball',
    defaultSets: 2,
    defaultReps: '60-90s per side with deep breathing',
    frequency: '4x weekly',
    videoUrl: 'https://www.youtube.com/watch?v=wPzwoG1WVgg',
    videoEmbedId: 'wPzwoG1WVgg',
    videoChannel: 'The Ready State / IT Band & TFL Mobility',
    rationale:
      'Rolling directly on the thick fibrous IT band tendon causes intense pain with zero tissue lengthening. Rolling the muscular anchor—the Tensor Fasciae Latae (TFL) and Gluteus Maximus—reduces tensile pull along the IT band.',
    techniqueCues: [
      'Lie slightly rotated on foam roller, targeting the fleshy pocket between the front hip bone (ASIS) and side of hip',
      'Support bodyweight with opposite foot and arms',
      'Roll slowly over a 2-3 inch zone of muscle belly for 60 seconds',
      'Pause on tender trigger spots and take 3 slow diaphragmatic breaths',
      'Shift roller slightly back onto gluteus maximus/medius belly and mobilize gently',
    ],
    commonMistakes: [
      'Rolling directly over the bony greater trochanter (Helen: crucial contraindication!)',
      'Rolling all the way down the outer knee bone',
    ],
    jointFriendlyModification:
      'Helen: If GTPS is irritable, roll only upper glute max and piriformis; do NOT roll directly over the hip bone.',
    safetyNotes: 'Aim for a 4/10 "good hurt" release sensation; stop if sharp nerve-like pain occurs.',
  },
];

// Export dedicated split 12-week rehabilitation schedules for each runner
export { ARWEL_12_WEEK_PLAN, HELEN_12_WEEK_PLAN };

/**
 * Returns the dedicated 12-week rehabilitation plan tailored specifically to the athlete's
 * symptoms, biomechanical dysfunctions, and contraindications:
 * - Arwel Thomas (63M, 71kg): Right adductor strain & swing-phase toe scuffing, lumbar facet irritation / extension overload, knee OA protection, bilateral ITB stiffness.
 * - Helen Shanley (58F, 59kg): Intermittent plantar fasciitis (Rathleff protocol with towel), GTPS / gluteal tendinopathy (wall isometric abduction, neutral clamshell with pillow), perimenopausal joint inflammation (grip-free loop bands, tendon glides).
 */
export function get12WeekPlanForAthlete(athleteId: AthleteId): PlanWeek[] {
  return athleteId === 'helen' ? HELEN_12_WEEK_PLAN : ARWEL_12_WEEK_PLAN;
}

/**
 * Helper to create a comprehensive combined 12-week matrix combining both athletes' routines
 * for master administrative views, multi-runner spreadsheet exports, and global reference.
 */
export function createCombined12WeekPlan(
  arwelPlan: PlanWeek[],
  helenPlan: PlanWeek[]
): PlanWeek[] {
  return arwelPlan.map((arwelW, wIdx) => {
    const helenW = helenPlan[wIdx] || arwelW;
    return {
      weekNumber: arwelW.weekNumber,
      phase: arwelW.phase,
      phaseName: arwelW.phaseName,
      weeklyObjective: `Arwel: ${arwelW.weeklyObjective} | Helen: ${helenW.weeklyObjective}`,
      targetWalkingRunningTolerance: `Arwel: ${arwelW.targetWalkingRunningTolerance} | Helen: ${helenW.targetWalkingRunningTolerance}`,
      athleteSpecificFocus: {
        arwel: arwelW.athleteSpecificFocus.arwel,
        helen: helenW.athleteSpecificFocus.helen,
      },
      days: arwelW.days.map((arwelDay, dIdx) => {
        const helenDay = helenW.days[dIdx] || arwelDay;
        const combinedExercises = [...arwelDay.exercises];
        helenDay.exercises.forEach((hEx) => {
          if (!combinedExercises.some((e) => e.exerciseId === hEx.exerciseId)) {
            combinedExercises.push(hEx);
          }
        });
        const isRest = arwelDay.isRestDay && helenDay.isRestDay && combinedExercises.length === 0;
        return {
          dayNumber: arwelDay.dayNumber,
          dayName: arwelDay.dayName,
          title: `${arwelDay.title} (Arwel) / ${helenDay.title} (Helen)`,
          focus: `Arwel: ${arwelDay.focus} | Helen: ${helenDay.focus}`,
          estimatedMinutes: Math.max(arwelDay.estimatedMinutes, helenDay.estimatedMinutes),
          isRestDay: isRest,
          exercises: combinedExercises,
        };
      }),
    };
  });
}

// Master combined schedule containing all exercises and sessions across both runners
export const COMBINED_12_WEEK_PLAN: PlanWeek[] = createCombined12WeekPlan(
  ARWEL_12_WEEK_PLAN,
  HELEN_12_WEEK_PLAN
);

// Backward-compatible export pointing to the full combined plan
export const FULL_12_WEEK_PLAN: PlanWeek[] = COMBINED_12_WEEK_PLAN;

export const INITIAL_SYNC_SERVICES: FitnessSyncService[] = [
  {
    id: 'apple_health',
    name: 'Apple Health',
    icon: 'HeartPulse',
    connected: true,
    lastSyncedAt: 'Today at 08:30 AM',
    metrics: {
      dailySteps: 9840,
      restingHeartRate: 54,
      hrvMs: 62,
      sleepScore: 88,
      cadenceAvgSpM: 174,
      groundContactBalance: '49.8% L / 50.2% R',
      strideLengthMeters: 1.08,
    },
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    icon: 'Watch',
    connected: true,
    lastSyncedAt: 'Today at 07:45 AM',
    metrics: {
      dailySteps: 10250,
      restingHeartRate: 52,
      hrvMs: 65,
      sleepScore: 91,
      cadenceAvgSpM: 176,
      groundContactBalance: '50.1% L / 49.9% R',
      strideLengthMeters: 1.11,
    },
  },
  {
    id: 'strava',
    name: 'Strava',
    icon: 'Activity',
    connected: true,
    lastSyncedAt: 'Yesterday at 06:15 PM',
    metrics: {
      dailySteps: 8900,
      restingHeartRate: 55,
      hrvMs: 59,
      sleepScore: 84,
      cadenceAvgSpM: 172,
      groundContactBalance: '49.2% L / 50.8% R',
      strideLengthMeters: 1.06,
    },
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: 'Radio',
    connected: false,
    lastSyncedAt: null,
    metrics: {
      dailySteps: 0,
      restingHeartRate: 0,
      hrvMs: 0,
      sleepScore: 0,
      cadenceAvgSpM: 0,
      groundContactBalance: '50.0% L / 50.0% R',
      strideLengthMeters: 1.05,
    },
  },
];

export const INITIAL_DAILY_LOGS: DailyLog[] = [
  {
    id: 'log-1',
    date: '2026-11-01',
    athleteId: 'arwel',
    painScore: 5,
    painAreas: {
      'Lower Back (Facet)': 5,
      'Right Adductor': 6,
      'Right Knee': 3,
      'IT Band': 4,
    },
    mobilityScore: 58,
    completedExerciseIds: ['mcgill-curlup', 'adductor-ball-squeeze', 'cat-cow-segmental'],
    perceivedExertion: 4,
    sleepHours: 7.2,
    hrvMs: 48,
    steps: 7200,
    notes: 'Auckland marathon recovery day 4. Right toe caught the rug this morning. Lower back stiff when standing straight.',
    gaitChecklist: {
      toeClearanceScore: 2,
      lateralHipStability: 3,
    },
  },
  {
    id: 'log-2',
    date: '2026-11-02',
    athleteId: 'arwel',
    painScore: 4,
    painAreas: {
      'Lower Back (Facet)': 4,
      'Right Adductor': 5,
      'Right Knee': 2,
      'IT Band': 3,
    },
    mobilityScore: 65,
    completedExerciseIds: [
      'mcgill-curlup',
      'mcgill-bird-dog',
      'adductor-ball-squeeze',
      'psoas-adductor-march',
      'tibialis-wall-raise',
    ],
    perceivedExertion: 4,
    sleepHours: 7.8,
    hrvMs: 54,
    steps: 8100,
    notes: 'Dead bug and psoas march helped. Concentrated on pulling the right toe up. Felt much better during afternoon walk.',
    gaitChecklist: {
      toeClearanceScore: 3,
      lateralHipStability: 4,
    },
  },
  {
    id: 'log-3',
    date: '2026-11-03',
    athleteId: 'arwel',
    painScore: 3,
    painAreas: {
      'Lower Back (Facet)': 3,
      'Right Adductor': 3,
      'Right Knee': 2,
      'IT Band': 2,
    },
    mobilityScore: 74,
    completedExerciseIds: [
      'mcgill-curlup',
      'copenhagen-plank-bent-knee',
      'banded-tke',
      'hip-flexor-tuck-stretch',
    ],
    perceivedExertion: 3,
    sleepHours: 8.0,
    hrvMs: 62,
    steps: 9200,
    notes: 'Zero toe scuffing during 25-minute brisk walk! Anterior abdominal brace keeps lower back from pinching.',
    gaitChecklist: {
      toeClearanceScore: 4,
      lateralHipStability: 4,
    },
  },
  {
    id: 'log-4',
    date: '2026-11-01',
    athleteId: 'helen',
    painScore: 6,
    painAreas: {
      'Right Plantar Fascia': 6,
      'Greater Trochanter (Hip)': 5,
      'Finger/Thumb Joints': 4,
    },
    mobilityScore: 52,
    completedExerciseIds: ['rathleff-plantar-raise', 'short-foot-intrinsic-doming'],
    perceivedExertion: 5,
    sleepHours: 6.8,
    hrvMs: 44,
    steps: 6800,
    notes: 'First morning step was sharp under the right heel. Thumb joints stiff after waking up. Warm water helped.',
    gaitChecklist: {
      firstStepPainVAS: 6,
      lateralHipStability: 3,
    },
  },
  {
    id: 'log-5',
    date: '2026-11-02',
    athleteId: 'helen',
    painScore: 4,
    painAreas: {
      'Right Plantar Fascia': 4,
      'Greater Trochanter (Hip)': 4,
      'Finger/Thumb Joints': 3,
    },
    mobilityScore: 64,
    completedExerciseIds: [
      'rathleff-plantar-raise',
      'isometric-hip-abduction-wall',
      'neutral-clamshell-cushioned',
      'wrist-finger-tendon-glides',
    ],
    perceivedExertion: 4,
    sleepHours: 7.5,
    hrvMs: 53,
    steps: 7900,
    notes: 'Wall abduction gave immediate pain relief to lateral hip. Rolled towel heel raise feels challenging but good.',
    gaitChecklist: {
      firstStepPainVAS: 4,
      lateralHipStability: 4,
    },
  },
  {
    id: 'log-6',
    date: '2026-11-03',
    athleteId: 'helen',
    painScore: 2,
    painAreas: {
      'Right Plantar Fascia': 2,
      'Greater Trochanter (Hip)': 2,
      'Finger/Thumb Joints': 2,
    },
    mobilityScore: 78,
    completedExerciseIds: [
      'rathleff-plantar-raise',
      'forearm-band-pull-apart',
      'banded-monster-walk',
      'wrist-finger-tendon-glides',
    ],
    perceivedExertion: 3,
    sleepHours: 8.1,
    hrvMs: 65,
    steps: 9100,
    notes: 'Sleeping with pillow between knees eliminated night hip ache! Forearm loop bands are a lifesaver for my thumbs.',
    gaitChecklist: {
      firstStepPainVAS: 2,
      lateralHipStability: 5,
    },
  },
];

export const INITIAL_ASSESSMENTS: Record<string, AssessmentResult> = {
  arwel: {
    date: '2026-11-01',
    athleteId: 'arwel',
    extensionIntoleranceVAS: 6,
    mcgillBig3ScoreSeconds: {
      curlUp: 35,
      sideBridgeL: 28,
      sideBridgeR: 24,
      birdDog: 30,
    },
    adductorSqueezeTolerance: 'Moderate',
    trendelenburgSign: 'Mild Drop',
    windlassTestPain: false,
    jointSwellingIndex: 'Mild Stiffness',
    calculatedReadinessTier: 'Foundational Re-education',
    actionableInsights: [
      'Lumbar facet pinching confirmed during standing backward extension test. Prioritize McGill modified curl-up and anterior core anti-extension.',
      'Right adductor squeeze causes mild groin irritation. Adductor longus strain confirmed as mechanical cause of swing-phase toe drag.',
      'Right knee demonstrates mild crepitus with zero joint effusion. Banded TKEs and Spanish squats recommended.',
    ],
  },
  helen: {
    date: '2026-11-01',
    athleteId: 'helen',
    extensionIntoleranceVAS: 2,
    mcgillBig3ScoreSeconds: {
      curlUp: 40,
      sideBridgeL: 25,
      sideBridgeR: 22,
      birdDog: 32,
    },
    adductorSqueezeTolerance: 'None',
    trendelenburgSign: 'Pronounced Drop',
    windlassTestPain: true,
    jointSwellingIndex: 'Active Flare',
    calculatedReadinessTier: 'Foundational Re-education',
    actionableInsights: [
      'Positive Windlass test confirms insertional plantar fasciitis. Rathleff high-load heel raises with rolled towel initiated.',
      'Pronounced Trendelenburg on right stance confirms gluteal tendinopathy / GTPS. Crossed-leg stretches strictly prohibited.',
      'Hand and wrist joint stiffness consistent with perimenopausal hormonal arthralgia. Grip-free forearm loop bands prescribed.',
    ],
  },
};
