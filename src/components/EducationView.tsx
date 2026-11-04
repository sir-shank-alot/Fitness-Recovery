import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, AlertCircle, ShieldCheck } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  athleteTarget: string;
  keyTakeaways: string[];
  content: string[];
}

export const EducationView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('toe-scuffing');

  const articles: Article[] = [
    {
      id: 'toe-scuffing',
      title: 'The Biomechanics of Toe Scuffing: Adductor & Hip Flexor Synergy',
      subtitle: 'Why an adductor strain results in inability to pick up the foot and toe dragging',
      category: 'Gait & Neuromuscular',
      athleteTarget: 'Arwel Thomas',
      keyTakeaways: [
        'The adductor longus is not just an adductor—it is a powerful anterior hip flexor in terminal extension.',
        'When strained, the nervous system downregulates hip flexion, delaying swing phase initiation.',
        'Compensations like hiking the hip or swinging the leg outward fail under marathon fatigue, causing the toe to catch the road.',
        'Copenhagen planks, isometric ball squeezes, and banded psoas marching restore the neural drive to clear the toe.',
      ],
      content: [
        'During the late stance phase of running, the hip is extended roughly 10–15 degrees behind the pelvis. At this exact anatomical moment, the line of pull of the adductor longus changes: it becomes one of the primary drivers accelerating the thigh forward into the swing phase.',
        'When Arwel experienced his adductor strain in the Auckland marathon, the tendon fibers became micro-traumatized. In response, protective neuromuscular inhibition (arthrogenic muscle inhibition) prevented normal forceful contraction.',
        'Because the hip flexor synergy was interrupted, the right leg swung forward late, the ankle remained slightly plantarflexed, and the right toe scuffed against the pavement.',
        'The remedy is not aggressive stretching (which tears healing adductor collagen), but submaximal isometrics followed by progressive Copenhagen adductor loading and conscious tibialis anterior toe elevation drills.',
      ],
    },
    {
      id: 'lumbar-facet',
      title: 'Lumbar Facet Joint Syndrome vs Disc Herniation in Runners',
      subtitle: 'Understanding extension overload, overly upright posture, and anterior core bracing',
      category: 'Spine Biomechanics',
      athleteTarget: 'Arwel Thomas',
      keyTakeaways: [
        'Running with an overly upright or leaning-back trunk concentrates body weight on the posterior facet joints (L4-S1).',
        'Unlike disc bulges (which hurt during bending forward), facet syndrome hurts during standing backward arching (extension intolerance).',
        'The McGill Big 3 builds a 360-degree muscular corset to stabilize the spine without flexing or extending the vertebrae.',
        'Cueing a 4–6 degree forward lean from the ankles unloads the posterior facet joints immediately.',
      ],
      content: [
        'The lumbar spine features posterior facet (zygapophyseal) joints that guide motion and prevent excessive translation. In distance running, when core fatigue sets in, runners frequently compensate by pulling their shoulders back and standing overly upright.',
        'This posture drives the lumbar spine into exaggerated lordosis, compressing the facet articular cartilage against each other with every foot strike.',
        'Traditional sit-ups and Roman chair back extensions exacerbate this pathology. Dr. Stuart McGill’s evidence-based protocol (Modified Curl-Up, Side Bridge, and Bird Dog) stabilizes the spinal canister while keeping the lumbar curve strictly neutral.',
      ],
    },
    {
      id: 'gtps-hip',
      title: 'Greater Trochanteric Pain Syndrome (GTPS): Why ITB Stretches Harm',
      subtitle: 'The compressive mechanism of gluteal tendinopathy and why isometrics provide pain relief',
      category: 'Hip Tendinopathy',
      athleteTarget: 'Helen Shanley',
      keyTakeaways: [
        'GTPS is predominantly gluteus medius and minimus insertional tendinopathy, not pure bursitis.',
        'Crossing your legs or pulling your knee across the chest compresses the tendon against the greater trochanter like a rope over a sharp rock.',
        'Stretching the IT band across midline worsens tendon compression and delays healing.',
        'Isometric hip abduction (wall press) triggers a powerful cortical analgesic response that calms tendon pain.',
      ],
      content: [
        'For decades, lateral hip pain was diagnosed as "trochanteric bursitis" and treated with anti-inflammatory injections and IT band stretching. Contemporary clinical research from leading tendon researchers has overturned this model.',
        'GTPS is primarily a insertional tendinopathy caused by compressive load. When the leg is pulled across the body (hip adduction)—such as during crossed-leg sitting, tightrope running, or piriformis stretches—the IT band acts as a vise, compressing the gluteus medius tendon directly against the bony trochanter.',
        'The golden rules for Helen: Never cross legs when sitting; sleep with a firm pillow between knees; widen step width slightly while running; and utilize standing isometric wall presses to stimulate tenocyte recovery without compressive shear.',
      ],
    },
    {
      id: 'rathleff-plantar',
      title: 'The Rathleff Protocol: The Science of High-Load Plantar Fascia Remodeling',
      subtitle: 'Why rolled-towel heel raises beat passive rest for intermittent plantar fasciitis',
      category: 'Foot & Ankle',
      athleteTarget: 'Helen Shanley',
      keyTakeaways: [
        'Plantar fasciitis is a degenerative collagen breakdown (fasciosis), not acute inflammatory fasciitis.',
        'Passive rest and cushioned insoles only mask pain; mechanical tensile load is required to realign disorganized collagen.',
        'Placing a rolled towel under the toes pre-tensions the Windlass mechanism, maximizing tensile stimulus.',
        'High-load slow concentric-eccentric cadence (3s up, 2s pause, 3s down) drives optimal mechanotransduction.',
      ],
      content: [
        'Dr. Michael Rathleff’s randomized controlled trial published in the British Journal of Sports Medicine demonstrated that high-load strength training produces superior long-term outcomes for plantar fasciitis compared to standard stretching.',
        'The plantar fascia anchors the medial calcaneus to the proximal phalanges. By elevating the toes over a rolled hand towel on a step, the Windlass mechanism is fully engaged.',
        'Performing calf raises in this pre-tensioned position applies controlled tensile strain directly into the insertional fibers, triggering cell signaling for collagen synthesis.',
      ],
    },
    {
      id: 'perimenopause-joints',
      title: 'Perimenopause, Estrogen Fluctuations & Runner Joint Arthralgia',
      subtitle: 'Ergonomic adaptations for finger, thumb, wrist, and elbow joint inflammation',
      category: 'Hormonal & Ergonomics',
      athleteTarget: 'Helen Shanley',
      keyTakeaways: [
        'Estrogen is a natural anti-inflammatory hormone and collagen protector with receptors throughout synovial linings.',
        'Perimenopausal estrogen fluctuations can cause episodic joint puffiness and tendon sensitivity in small joints (thumbs, wrists, fingers, elbows).',
        'Eliminate heavy dumbbell gripping that puts compressive shear on the CMC thumb joint.',
        'Loop elastic mini-bands around forearms or use wrist straps to train back and shoulders completely grip-free.',
      ],
      content: [
        'Many female master runners in their late 40s and 50s experience mysterious joint stiffness in their hands, wrists, thumbs, and elbows that does not correlate with trauma. This is musculoskeletal syndrome of menopause (perimenopausal arthralgia).',
        'Estrogen plays an integral role in regulating joint synovial fluid and collagen turnover. When estrogen fluctuates, tendons become more vulnerable to friction and small joint capsules retain fluid.',
        'By utilizing forearm loop bands, push-up blocks that keep the wrist straight, and warm-water paraffin soaks, Helen can achieve full thoracic and scapular strength without irritating finger and thumb joints.',
      ],
    },
    {
      id: 'knee-oa-runner',
      title: 'Managing Knee Osteoarthritis in Master Marathoners',
      subtitle: 'Why cartilage loves controlled loading, Spanish squats, and terminal knee extensions',
      category: 'Degenerative Joint Care',
      athleteTarget: 'Arwel Thomas',
      keyTakeaways: [
        'Running does not destroy arthritic knee joints—cyclic loading actually pumps synovial nutrients into articular cartilage.',
        'Avoid deep open-chain leg extensions that generate high patellofemoral shear.',
        'Terminal Knee Extensions (TKE) strengthen the vastus medialis oblique (VMO) at safe shallow angles.',
        'Spanish squats with a strap behind the knees maintain vertical shins, offloading the anterior knee.',
      ],
      content: [
        'Articular cartilage has no direct blood supply; it depends on cyclic joint pressure to diffuse nutrients and oxygen from synovial fluid. Multiple meta-analyses show that recreational runners have lower rates of knee replacement than sedentary individuals.',
        'Arwel’s mild right knee osteoarthritis requires smart strength vectors: avoiding high anterior patellofemoral shear while building quadriceps and hamstring stiffness.',
        'Spanish squats with a heavy band anchored behind the knee allow vertical shins, isolating quad contraction while completely protecting the patellofemoral joint line.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Clinical Biomechanics &amp; Recovery Library</h2>
            <p className="text-xs text-slate-400">
              In-depth sports science and evidence-based rationale behind each protocol component
            </p>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {articles.map((article) => {
          const isOpen = expandedId === article.id;
          return (
            <div
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition shadow-xl"
            >
              <button
                onClick={() => setExpandedId(isOpen ? '' : article.id)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {article.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      Focus: {article.athleteTarget}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{article.title}</h3>
                  <p className="text-xs text-slate-400">{article.subtitle}</p>
                </div>

                <span className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-5 animate-in fade-in">
                  {/* Key Takeaways Box */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Core Clinical Takeaways
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {article.keyTakeaways.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Article Paragraphs */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {article.content.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
