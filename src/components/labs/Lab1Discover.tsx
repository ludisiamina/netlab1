import React, { useState } from 'react';
import {
  Monitor,
  Printer,
  Laptop,
  HardDrive,
  Send,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab1Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'pc' | 'laptop' | 'printer' | 'switch';
  ip: string;
  mac: string;
  status: string;
  role: string;
  sharedItem?: string;
  x: number;
  y: number;
}

const NODES: NetworkNode[] = [
  {
    id: 'pc1',
    name: 'حاسوب المكتب 1 (PC-A)',
    type: 'pc',
    ip: '192.168.1.10',
    mac: '00:1A:2B:3C:4D:10',
    status: 'متصل وجاهز',
    role: 'جهاز محطة عمل (Station de travail)',
    sharedItem: 'مجلد المستندات والتقارير',
    x: 18,
    y: 25,
  },
  {
    id: 'pc2',
    name: 'حاسوب الأستاذ (PC-B)',
    type: 'pc',
    ip: '192.168.1.20',
    mac: '00:1A:2B:3C:4D:20',
    status: 'متصل وجاهز',
    role: 'جهاز رئيسي للإشراف',
    sharedItem: 'بنك الفروض والاختبارات',
    x: 18,
    y: 75,
  },
  {
    id: 'laptop1',
    name: 'حاسوب محمول (Laptop-C)',
    type: 'laptop',
    ip: '192.168.1.30',
    mac: '00:1A:2B:3C:4D:30',
    status: 'متصل لاسلكياً / سلكياً',
    role: 'محطة عمل متنقلة',
    sharedItem: 'عروض تقديمية تفاعلية',
    x: 82,
    y: 25,
  },
  {
    id: 'printer1',
    name: 'طابعة شبكية (Printer-HP)',
    type: 'printer',
    ip: '192.168.1.50',
    mac: '00:1A:2B:3C:4D:50',
    status: 'جاهزة للطباعة',
    role: 'مورد مادي مشترك (Ressource matérielle)',
    sharedItem: 'خدمة الطباعة عن بُعد لجميع الأجهزة',
    x: 82,
    y: 75,
  },
];

export const Lab1Discover: React.FC<Lab1Props> = ({ onComplete, onBackToMenu }) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(NODES[0]);
  const [sourceNode, setSourceNode] = useState<string>('pc1');
  const [targetNode, setTargetNode] = useState<string>('printer1');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<boolean>(false);

  // Discovery questions state
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>({
    q1: null,
    q2: null,
    q3: null,
  });
  const [showDefinition, setShowDefinition] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleTransmit = () => {
    if (sourceNode === targetNode) {
      sound.playError();
      return;
    }
    sound.playPacket();
    setIsTransmitting(true);
    setTransmissionSuccess(false);

    setTimeout(() => {
      setIsTransmitting(false);
      setTransmissionSuccess(true);
      sound.playSuccess();
    }, 1800);
  };

  const checkAnswer = (qKey: 'q1' | 'q2' | 'q3', optionIndex: number, correctIndex: number) => {
    sound.playClick();
    setAnswers((prev) => ({ ...prev, [qKey]: optionIndex }));
    if (optionIndex === correctIndex) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const allQuestionsCorrect =
    answers.q1 === 1 && answers.q2 === 0 && answers.q3 === 2;

  const handleFinishLab = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      sound.playFanfare();
      onComplete(150, 'badge_discover');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>المختبر الأول</span>
            <span>•</span>
            <span className="font-mono">Découverte du Réseau</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            اكتشف مفهوم الشبكة وأهدافها
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMenu();
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للقائمة
          </button>
        </div>
      </div>

      {/* Robot Mentor */}
      <NettoMentor
        message="أهلاً بك! انظر إلى الحواسيب في مساحة العمل أدناه. اضغط على كل جهاز لتفحصه، وجرّب إرسال حزمة بيانات بينها، ثم أجب عن أسئلة الاستكشاف لاستخلاص تعريف الشبكة المحلية."
        mood={allQuestionsCorrect ? 'excited' : 'happy'}
      />

      {/* Interactive Network Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Network Simulation Canvas (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-cyan-800/50 rounded-2xl p-5 relative overflow-hidden shadow-xl min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-md">
              مخطط الشبكة التفاعلي (Interactive Topology)
            </span>
            <span className="text-xs text-slate-400">انقر على أي جهاز لمعاينته</span>
          </div>

          {/* SVG Connection Lines & Active Packets */}
          <div className="relative w-full h-[300px] my-auto">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Lines from Central Switch (50%, 50%) to each device */}
              {NODES.map((node) => (
                <line
                  key={`line-${node.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${node.x}%`}
                  y2={`${node.y}%`}
                  stroke="#1E293B"
                  strokeWidth="3"
                />
              ))}

              {/* Active data cable highlighted */}
              {isTransmitting && (
                <>
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${NODES.find((n) => n.id === sourceNode)?.x}%`}
                    y2={`${NODES.find((n) => n.id === sourceNode)?.y}%`}
                    stroke="#00F0FF"
                    strokeWidth="3"
                    className="animate-signal-fast"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${NODES.find((n) => n.id === targetNode)?.x}%`}
                    y2={`${NODES.find((n) => n.id === targetNode)?.y}%`}
                    stroke="#38BDF8"
                    strokeWidth="3"
                    className="animate-signal-fast"
                  />
                </>
              )}
            </svg>

            {/* Central Hub / Switch */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-16 h-12 bg-slate-800 border-2 border-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="flex gap-1">
                  <span className={`w-2 h-2 rounded-full ${isTransmitting ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-cyan-300 mt-1">Switch المحول</span>
            </div>

            {/* Network Nodes */}
            {NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isSrc = sourceNode === node.id;
              const isDst = targetNode === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedNode(node);
                  }}
                  style={{ top: `${node.y}%`, left: `${node.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer transition-all ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 transition-all shadow-md ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/30 shadow-cyan-500/40'
                        : isSrc
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : isDst
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {node.type === 'pc' && <Monitor className="w-7 h-7" />}
                    {node.type === 'laptop' && <Laptop className="w-7 h-7" />}
                    {node.type === 'printer' && <Printer className="w-7 h-7" />}
                  </div>

                  <span
                    className={`text-[11px] font-bold mt-1.5 px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800'
                    }`}
                  >
                    {node.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Data transmission panel */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">من:</span>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-cyan-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-400"
              >
                {NODES.map((n) => (
                  <option key={`src-${n.id}`} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>

              <span className="text-slate-400 mr-2">إلى:</span>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-cyan-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-400"
              >
                {NODES.map((n) => (
                  <option key={`dst-${n.id}`} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTransmit}
              disabled={isTransmitting}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isTransmitting ? 'جاري الإرسال...' : 'إرسال حزمة بيانات'}
            </button>
          </div>

          {transmissionSuccess && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>
                تم تبادل البيانات بنجاح بين الجهازين عبر وسائط الاتصال والمحول! هذا يجسد وظيفة الشبكة الأساسية.
              </span>
            </div>
          )}
        </div>

        {/* Selected Node Details Card (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">بطاقة الجهاز المحدد في الشبكة</h3>
            </div>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">اسم الجهاز:</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedNode.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">عنوان IP</span>
                    <p className="font-mono text-cyan-300 font-bold">{selectedNode.ip}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">عنوان MAC</span>
                    <p className="font-mono text-slate-300 text-[10px]">{selectedNode.mac}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">الدور الوظيفي:</span>
                  <p className="text-slate-200 mt-0.5">{selectedNode.role}</p>
                </div>

                <div className="bg-cyan-950/30 border border-cyan-800/40 p-2.5 rounded-xl">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    المورد المتاح للمشاركة:
                  </span>
                  <p className="text-slate-200 mt-1">{selectedNode.sharedItem}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">اضغط على جهاز في المخطط لعرض بياناته التقنية.</p>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            💡 <strong className="text-cyan-300">ملاحظة بيداغوجية:</strong> في الشبكة المحلية، يمتلك كل جهاز معرفاً فريداً يسمى عنوان IP لضمان وصول الرسائل إلى وجهتها الصحيحة.
          </div>
        </div>
      </div>

      {/* Discovery Questions Section */}
      <div className="bg-slate-900/90 border border-cyan-800/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            أنشطة الاستكشاف البيداغوجية (أجب لاستخلاص مفهوم الشبكة)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Question 1 */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-300">1. ما الذي يربط هذه الحواسيب معاً؟</h4>
            <div className="space-y-2">
              {['كابلات الكهرباء 220V فقط', 'وسائط اتصال (كابلات شبكة أو إشارات لاسلكية)', 'برامج مكافحة الفيروسات'].map(
                (opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => checkAnswer('q1', idx, 1)}
                    className={`w-full text-right p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      answers.q1 === idx
                        ? idx === 1
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-rose-950 border border-rose-500 text-rose-300'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
            {answers.q1 === 1 && (
              <p className="text-[11px] text-emerald-400">✓ أحسنت! وسائط الاتصال قد تكون سلكية كالكابلات أو لاسلكية كأمواج Wi-Fi.</p>
            )}
          </div>

          {/* Question 2 */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-300">2. لماذا نربط عدة حواسيب في شبكة؟</h4>
            <div className="space-y-2">
              {[
                'لتبادل المعلومات ومشاركة الموارد المادية والبرمجية',
                'لزيادة استهلاك الطاقة الكهربائية',
                'لجعل الحواسيب تعمل بدون شاشات',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => checkAnswer('q2', idx, 0)}
                  className={`w-full text-right p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                    answers.q2 === idx
                      ? idx === 0
                        ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-rose-950 border border-rose-500 text-rose-300'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answers.q2 === 0 && (
              <p className="text-[11px] text-emerald-400">✓ ممتاز! الهدف الأساسي هو الاتصال والتشارك وتوفير التكاليف.</p>
            )}
          </div>

          {/* Question 3 */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-300">3. ما هي فوائد مشاركة الموارد؟</h4>
            <div className="space-y-2">
              {[
                'تسمح فقط بنسخ الألعاب',
                'تمنع المستخدمين من استعمال الطابعات',
                'مشاركة الموارد المادية (طابعة، ماسح) والبرمجية (ملفات، برامج)',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => checkAnswer('q3', idx, 2)}
                  className={`w-full text-right p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                    answers.q3 === idx
                      ? idx === 2
                        ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-rose-950 border border-rose-500 text-rose-300'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answers.q3 === 2 && (
              <p className="text-[11px] text-emerald-400">✓ رائع! مشاركة الموارد تقلل تكلفة شراء الأجهزة لكل مستخدم وتسهل العمل الجماعي.</p>
            )}
          </div>
        </div>

        {/* Reveal Definition of Network based on Curriculum */}
        {allQuestionsCorrect && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-3">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/70 to-slate-900 border-2 border-cyan-500 shadow-xl">
              <div className="flex items-center gap-2 mb-2 text-cyan-300">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  خلاصة الدرس – تعريف الشبكة المحلية (Réseau Local - LAN)
                </span>
              </div>
              <p className="text-base text-slate-100 font-bold leading-relaxed">
                «الشبكة المعلوماتية (Réseau Informatique) هي مجموعة من الحواسيب والأجهزة الملحقة المتصلة فيما بينها بواسطة وسائط اتصال (سلكية أو لاسلكية) لتبادل المعلومات والبيانات ومشاركة الموارد المادية (كالطابعات) والبرمجية (كالبرامج والملفات).»
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-cyan-300/80 font-mono">
                <span>Réseau Informatique</span>
                <span>•</span>
                <span>Partage des Ressources</span>
                <span>•</span>
                <span>Échange de Données</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFinishLab}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm cursor-pointer hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {isCompleted ? 'تم إكمال المختبر وحصد الشارة ✓' : 'إتمام المختبر وحصد 150 نقطة والشارة'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
