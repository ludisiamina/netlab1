import React, { useState } from 'react';
import {
  GitBranch,
  Circle,
  Star,
  Monitor,
  Printer,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Cable,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab3Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

type TopologyType = 'bus' | 'ring' | 'star' | 'challenge';

export const Lab3Topology: React.FC<Lab3Props> = ({ onComplete, onBackToMenu }) => {
  const [activeTab, setActiveTab] = useState<TopologyType>('bus');

  // --- BUS STATE ---
  const [busConnectedNodes, setBusConnectedNodes] = useState<string[]>([]);
  const [busMessage, setBusMessage] = useState<string | null>(null);
  const [busTransmitting, setBusTransmitting] = useState(false);
  const [busErrorWarning, setBusErrorWarning] = useState<string | null>(null);

  // --- RING STATE ---
  const [ringConnections, setRingConnections] = useState<[number, number][]>([]);
  const [ringTransmitting, setRingTransmitting] = useState(false);
  const [ringMessage, setRingMessage] = useState<string | null>(null);

  // --- STAR STATE ---
  const [starConnections, setStarConnections] = useState<string[]>([]); // nodes connected to switch
  const [starTransmitting, setStarTransmitting] = useState(false);
  const [starSender, setStarSender] = useState<string>('pc1');
  const [starReceiver, setStarReceiver] = useState<string>('printer');
  const [starAlert, setStarAlert] = useState<string | null>(null);

  // --- CHALLENGE STATE ---
  const [challengeTarget] = useState<'star'>('star');
  const [challengeConnected, setChallengeConnected] = useState<string[]>([]);
  const [challengeResult, setChallengeResult] = useState<{ success: boolean; msg: string } | null>(null);

  // General Completed
  const [isCompleted, setIsCompleted] = useState(false);

  // ----------------------------------------------------
  // BUS HANDLERS
  // ----------------------------------------------------
  const handleConnectBusNode = (nodeId: string) => {
    sound.playConnect();
    setBusErrorWarning(null);
    if (busConnectedNodes.includes(nodeId)) {
      setBusConnectedNodes(busConnectedNodes.filter((id) => id !== nodeId));
    } else {
      const updated = [...busConnectedNodes, nodeId];
      setBusConnectedNodes(updated);
      if (updated.length === 4) {
        sound.playSuccess();
        setBusMessage('رائع! جميع الحواسيب موصولة بالكابل الرئيسي (Bus). اضغط على اختبار حركة البيانات لمعاينة الإشارات!');
      }
    }
  };

  const handleTryAddSwitchToBus = () => {
    sound.playError();
    setBusErrorWarning(
      'تنبيه بيداغوجي: هذا ليس شكل طوبولوجيا الباص في الدرس! طوبولوجيا الحافلة (BUS) تعتمد فقط على كابل محوري رئيسي مشترك (Backbone) بدون أي Switch، وتنتهي بسدادات مقاومة (Bouchons de terminaison).'
    );
  };

  const handleRunBusTraffic = () => {
    if (busConnectedNodes.length < 3) {
      sound.playError();
      setBusErrorWarning('يجب توصيل 3 حواسيب على الأقل بالكابل الرئيسي لاختبار حركة البيانات.');
      return;
    }
    sound.playPacket();
    setBusTransmitting(true);
    setBusErrorWarning(null);
    setBusMessage('البيانات تنتقل الآن عبر الكابل الرئيسي في الاتجاهين وتصل لجميع الأجهزة، ولكن الحاسوب المستهدف فقط يقبلها!');

    setTimeout(() => {
      setBusTransmitting(false);
      sound.playSuccess();
    }, 2500);
  };

  // ----------------------------------------------------
  // RING HANDLERS
  // ----------------------------------------------------
  const handleToggleRingLink = (a: number, b: number) => {
    sound.playConnect();
    const linkExists = ringConnections.some(
      (c) => (c[0] === a && c[1] === b) || (c[0] === b && c[1] === a)
    );
    let updated: [number, number][];
    if (linkExists) {
      updated = ringConnections.filter(
        (c) => !((c[0] === a && c[1] === b) || (c[0] === b && c[1] === a))
      );
    } else {
      updated = [...ringConnections, [a, b]];
    }
    setRingConnections(updated);

    // Check if fully closed ring: needs links (1,2), (2,3), (3,4), (4,1)
    const has12 = updated.some((c) => (c[0] === 1 && c[1] === 2) || (c[0] === 2 && c[1] === 1));
    const has23 = updated.some((c) => (c[0] === 2 && c[1] === 3) || (c[0] === 3 && c[1] === 2));
    const has34 = updated.some((c) => (c[0] === 3 && c[1] === 4) || (c[0] === 4 && c[1] === 3));
    const has41 = updated.some((c) => (c[0] === 4 && c[1] === 1) || (c[0] === 1 && c[1] === 4));

    if (has12 && has23 && has34 && !has41) {
      setRingMessage('الشبكة غير مكتملة، حاول ربط الجهاز الأخير بالأول لتكوين حلقة مغلقة (Boucle fermée).');
      sound.playError();
    } else if (has12 && has23 && has34 && has41) {
      sound.playSuccess();
      setRingMessage('ممتاز! اكتملت الحلقة المغلقة. البيانات تدور الآن في اتجاه واحد من حاسوب إلى آخر عبر رمز المرور (Token).');
    } else {
      setRingMessage(null);
    }
  };

  const handleRunRingTraffic = () => {
    const isClosed =
      ringConnections.some((c) => (c[0] === 1 && c[1] === 2) || (c[0] === 2 && c[1] === 1)) &&
      ringConnections.some((c) => (c[0] === 2 && c[1] === 3) || (c[0] === 3 && c[1] === 2)) &&
      ringConnections.some((c) => (c[0] === 3 && c[1] === 4) || (c[0] === 4 && c[1] === 3)) &&
      ringConnections.some((c) => (c[0] === 4 && c[1] === 1) || (c[0] === 1 && c[1] === 4));

    if (!isClosed) {
      sound.playError();
      setRingMessage('الشبكة غير مكتملة، حاول ربط الجهاز الأخير بالأول لتكوين حلقة مغلقة قبل تشغيل البيانات!');
      return;
    }
    sound.playPacket();
    setRingTransmitting(true);
    setTimeout(() => {
      setRingTransmitting(false);
      sound.playSuccess();
    }, 2800);
  };

  // ----------------------------------------------------
  // STAR HANDLERS
  // ----------------------------------------------------
  const handleConnectStarDevice = (devId: string) => {
    sound.playConnect();
    setStarAlert(null);
    if (starConnections.includes(devId)) {
      setStarConnections(starConnections.filter((id) => id !== devId));
    } else {
      const updated = [...starConnections, devId];
      setStarConnections(updated);
      if (updated.length === 4) {
        sound.playSuccess();
      }
    }
  };

  const handleInvalidPCDirectConnect = () => {
    sound.playError();
    setStarAlert(
      'خطأ في طوبولوجيا النجمة! في طوبولوجيا النجمة (STAR) حسب درس المنهاج، يجب ربط كل جهاز مباشرة بالمحول المركزي (Switch) وليس بحاسوب آخر. هذا يمنع انقطاع الشبكة عن باقي الأجهزة إذا تعطل أحد الحواسيب!'
    );
  };

  const handleRunStarTraffic = () => {
    if (!starConnections.includes(starSender) || !starConnections.includes(starReceiver)) {
      sound.playError();
      setStarAlert('يجب أن يكون كلا الجهازين متصلين بالمحول المركزي (Switch) لإرسال البيانات!');
      return;
    }
    sound.playPacket();
    setStarTransmitting(true);
    setStarAlert(null);

    setTimeout(() => {
      setStarTransmitting(false);
      sound.playSuccess();
      setStarAlert(`نجاح! انتقلت البيانات من ${starSender === 'pc1' ? 'PC-1' : 'الحاسوب'} إلى Switch ثم قام Switch بتوجيهها مباشرة وفقط إلى ${starReceiver === 'printer' ? 'الطابعة' : 'الحاسوب المستهدف'}.`);
    }, 2000);
  };

  // ----------------------------------------------------
  // CHALLENGE HANDLERS
  // ----------------------------------------------------
  const handleChallengeToggle = (devId: string) => {
    sound.playConnect();
    if (challengeConnected.includes(devId)) {
      setChallengeConnected(challengeConnected.filter((id) => id !== devId));
    } else {
      setChallengeConnected([...challengeConnected, devId]);
    }
    setChallengeResult(null);
  };

  const handleVerifyChallenge = () => {
    // Challenge is star topology with 4 devices (pc1, pc2, pc3, printer)
    if (challengeConnected.length === 4) {
      sound.playFanfare();
      setChallengeResult({
        success: true,
        msg: 'أحسنت صنعاً! لقد قمت ببناء طوبولوجيا نجمية متكاملة وسليمة 100% بدون أي مساعدة. أنت مؤهل الآن لنيل شارة مهندس الطوبولوجيا!',
      });
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete(350, 'badge_topology');
      }
    } else {
      sound.playError();
      setChallengeResult({
        success: false,
        msg: `الشبكة غير مكتملة! لقد قمت بربط ${challengeConnected.length} أجهزة فقط من أصل 4 بالمحول المركزي Switch. قم بربط جميع الأجهزة وافحص من جديد.`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <span>المختبر الثالث (الأهم)</span>
            <span>•</span>
            <span className="font-mono">Topologies de Réseau</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            مختبر محاكاة وبناء الطوبولوجيات
          </h1>
        </div>

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

      {/* Robot Mentor */}
      <NettoMentor
        message="طوبولوجيا الشبكة (Topology) هي الهيكل الهندسي أو الطريقة الفيزيائية التي تُربط بها الحواسيب. جرّب بناء الطوبولوجيات الثلاث المقررة في درسك: الحافلة (Bus)، الحلقة (Ring)، والنجمة (Star)، ثم اختبر مهارتك في التحدي المستقل!"
        mood={isCompleted ? 'excited' : 'happy'}
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('bus');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bus'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          أ- طوبولوجيا الحافلة (BUS)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('ring');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ring'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Circle className="w-4 h-4" />
          ب- طوبولوجيا الحلقة (RING)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('star');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'star'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          ج- طوبولوجيا النجمة (STAR)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('challenge');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer mr-auto ${
            activeTab === 'challenge'
              ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
              : 'bg-slate-950 border border-cyan-500/40 text-cyan-300 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          تحدي: ابنِ شبكتك بنفسك
        </button>
      </div>

      {/* ==================================================== */}
      {/* 1. BUS TOPOLOGY SIMULATION */}
      {/* ==================================================== */}
      {activeTab === 'bus' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">طوبولوجيا الحافلة / الباص (Topologie en Bus)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تعتمد على كابل محوري رئيسي مشترك واحد تتصل به الحواسيب عبر وصلات T، مع سدادة (Terminator) عند كل طرف.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTryAddSwitchToBus}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  محاولة إضافة محول Switch
                </button>

                <button
                  onClick={handleRunBusTraffic}
                  disabled={busTransmitting}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {busTransmitting ? 'جاري بث الإشارة...' : 'اختبار حركة البيانات'}
                </button>
              </div>
            </div>

            {/* Bus Canvas */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[320px] flex flex-col justify-between overflow-hidden">
              {/* Top Row: Computers to connect */}
              <div className="grid grid-cols-4 gap-4 z-10">
                {[
                  { id: 'pc1', label: 'حاسوب 1 (PC-1)' },
                  { id: 'pc2', label: 'حاسوب 2 (PC-2)' },
                  { id: 'pc3', label: 'حاسوب 3 (PC-3)' },
                  { id: 'pc4', label: 'حاسوب 4 (PC-4)' },
                ].map((pc) => {
                  const isConnected = busConnectedNodes.includes(pc.id);
                  return (
                    <div key={pc.id} className="flex flex-col items-center">
                      <button
                        onClick={() => handleConnectBusNode(pc.id)}
                        className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <Monitor className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{pc.label.split(' ')[0]}</span>
                      </button>

                      <button
                        onClick={() => handleConnectBusNode(pc.id)}
                        className={`mt-2 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isConnected ? 'موصول بالكابل ✓' : 'اضغط للتوصيل'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Main Bus Trunk (Coaxial Cable) Visual */}
              <div className="relative my-8 z-10">
                {/* SVG Drop cables from PCs to Main Trunk */}
                <svg className="absolute -top-12 left-0 w-full h-12 pointer-events-none">
                  {['pc1', 'pc2', 'pc3', 'pc4'].map((id, index) => {
                    const isConnected = busConnectedNodes.includes(id);
                    if (!isConnected) return null;
                    const xPercent = 12.5 + index * 25;
                    return (
                      <line
                        key={`drop-${id}`}
                        x1={`${xPercent}%`}
                        y1="0"
                        x2={`${xPercent}%`}
                        y2="100%"
                        stroke={busTransmitting ? '#F59E0B' : '#0284C7'}
                        strokeWidth="4"
                        className={busTransmitting ? 'animate-signal-fast' : ''}
                      />
                    );
                  })}
                </svg>

                {/* Horizontal Trunk Cable */}
                <div className="relative flex items-center justify-between h-5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full border-2 border-slate-500 px-1 shadow-inner">
                  {/* Left Terminator */}
                  <div className="w-5 h-7 bg-amber-500 border border-amber-300 rounded-sm flex items-center justify-center text-[9px] font-bold text-slate-950 -mr-2 shadow">
                    T
                  </div>

                  {/* Animated Traffic overlay */}
                  {busTransmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 rounded-full opacity-80 animate-pulse" />
                  )}

                  {/* T-connectors markers */}
                  <div className="flex-1 flex justify-around">
                    {['pc1', 'pc2', 'pc3', 'pc4'].map((id) => (
                      <div
                        key={`bouchon-${id}`}
                        className={`w-3 h-3 rounded-full border-2 ${
                          busConnectedNodes.includes(id)
                            ? 'bg-amber-400 border-amber-200'
                            : 'bg-slate-800 border-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Right Terminator */}
                  <div className="w-5 h-7 bg-amber-500 border border-amber-300 rounded-sm flex items-center justify-center text-[9px] font-bold text-slate-950 -ml-2 shadow">
                    T
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>سدادة نهاية (Bouchon 50Ω)</span>
                  <span className="font-bold text-amber-400">الكابل المحوري الرئيسي المشترك (Câble Coaxial Bus)</span>
                  <span>سدادة نهاية (Bouchon 50Ω)</span>
                </div>
              </div>

              {/* Status / Alert feedback */}
              {busErrorWarning && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{busErrorWarning}</span>
                </div>
              )}

              {busMessage && !busErrorWarning && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{busMessage}</span>
                </div>
              )}
            </div>

            {/* Bus Pedagogical Summary Card */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400">✓ مميزات طوبولوجيا الحافلة (Avantages):</span>
                <p className="text-slate-300">سهلة التركيب، تتطلب طولاً قليلاً من الكابلات، وغير مكلفة مقارنة بالطوبولوجيات الأخرى.</p>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-rose-400">✗ عيوب طوبولوجيا الحافلة (Inconvénients):</span>
                <p className="text-slate-300">إذا انقطع الكابل الرئيسي يتعطل الاتصال في الشبكة بأكملها، وصعوبة تحديد مكان العطب.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. RING TOPOLOGY SIMULATION */}
      {/* ==================================================== */}
      {activeTab === 'ring' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">طوبولوجيا الحلقة (Topologie en Anneau)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  يرتبط كل حاسوب بالحاسوب المجاور له مباشرة لتكوين حلقة مغلقة (Boucle fermée) تدور فيها الرسائل باتجاه محدد.
                </p>
              </div>

              <button
                onClick={handleRunRingTraffic}
                disabled={ringTransmitting}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {ringTransmitting ? 'جاري دوران الرمز (Token)...' : 'تشغيل دوران البيانات في الحلقة'}
              </button>
            </div>

            {/* Ring Canvas */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[380px] flex flex-col justify-center items-center overflow-hidden">
              {/* Circular SVG Cable Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* 4 Nodes circular coordinates:
                    PC1: (50%, 20%)
                    PC2: (80%, 50%)
                    PC3: (50%, 80%)
                    PC4: (20%, 50%)
                */}
                {/* Link 1-2 */}
                {ringConnections.some((c) => (c[0] === 1 && c[1] === 2) || (c[0] === 2 && c[1] === 1)) && (
                  <line
                    x1="50%"
                    y1="22%"
                    x2="80%"
                    y2="50%"
                    stroke={ringTransmitting ? '#F59E0B' : '#0284C7'}
                    strokeWidth="4"
                    className={ringTransmitting ? 'animate-signal-fast' : ''}
                  />
                )}
                {/* Link 2-3 */}
                {ringConnections.some((c) => (c[0] === 2 && c[1] === 3) || (c[0] === 3 && c[1] === 2)) && (
                  <line
                    x1="80%"
                    y1="50%"
                    x2="50%"
                    y2="78%"
                    stroke={ringTransmitting ? '#F59E0B' : '#0284C7'}
                    strokeWidth="4"
                    className={ringTransmitting ? 'animate-signal-fast' : ''}
                  />
                )}
                {/* Link 3-4 */}
                {ringConnections.some((c) => (c[0] === 3 && c[1] === 4) || (c[0] === 4 && c[1] === 3)) && (
                  <line
                    x1="50%"
                    y1="78%"
                    x2="20%"
                    y2="50%"
                    stroke={ringTransmitting ? '#F59E0B' : '#0284C7'}
                    strokeWidth="4"
                    className={ringTransmitting ? 'animate-signal-fast' : ''}
                  />
                )}
                {/* Link 4-1 (Closing Link) */}
                {ringConnections.some((c) => (c[0] === 4 && c[1] === 1) || (c[0] === 1 && c[1] === 4)) && (
                  <line
                    x1="20%"
                    y1="50%"
                    x2="50%"
                    y2="22%"
                    stroke={ringTransmitting ? '#F59E0B' : '#0284C7'}
                    strokeWidth="4"
                    className={ringTransmitting ? 'animate-signal-fast' : ''}
                  />
                )}
              </svg>

              {/* Node 1: Top (PC 1) */}
              <div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center p-2 shadow-lg">
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 1</span>
                </div>
              </div>

              {/* Node 2: Right (PC 2) */}
              <div className="absolute top-1/2 right-[12%] -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center p-2 shadow-lg">
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 2</span>
                </div>
              </div>

              {/* Node 3: Bottom (PC 3) */}
              <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center p-2 shadow-lg">
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 3</span>
                </div>
              </div>

              {/* Node 4: Left (PC 4) */}
              <div className="absolute top-1/2 left-[12%] -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center p-2 shadow-lg">
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 4</span>
                </div>
              </div>

              {/* Interactive Connection Buttons in Center */}
              <div className="z-30 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl flex flex-col items-center gap-2 shadow-2xl backdrop-blur-sm max-w-xs text-center">
                <span className="text-xs font-bold text-white">روابط الحلقة (اضغط لتوصيل الكابل):</span>
                <div className="grid grid-cols-2 gap-1.5 w-full">
                  <button
                    onClick={() => handleToggleRingLink(1, 2)}
                    className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                      ringConnections.some((c) => (c[0] === 1 && c[1] === 2) || (c[0] === 2 && c[1] === 1))
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    وصل PC1 ➔ PC2
                  </button>
                  <button
                    onClick={() => handleToggleRingLink(2, 3)}
                    className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                      ringConnections.some((c) => (c[0] === 2 && c[1] === 3) || (c[0] === 3 && c[1] === 2))
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    وصل PC2 ➔ PC3
                  </button>
                  <button
                    onClick={() => handleToggleRingLink(3, 4)}
                    className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                      ringConnections.some((c) => (c[0] === 3 && c[1] === 4) || (c[0] === 4 && c[1] === 3))
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    وصل PC3 ➔ PC4
                  </button>
                  <button
                    onClick={() => handleToggleRingLink(4, 1)}
                    className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                      ringConnections.some((c) => (c[0] === 4 && c[1] === 1) || (c[0] === 1 && c[1] === 4))
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    وصل PC4 ➔ PC1 (إغلاق)
                  </button>
                </div>
              </div>
            </div>

            {/* Ring Message */}
            {ringMessage && (
              <div
                className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  ringMessage.includes('غير مكتملة')
                    ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                    : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                }`}
              >
                {ringMessage.includes('غير مكتملة') ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{ringMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. STAR TOPOLOGY SIMULATION */}
      {/* ==================================================== */}
      {activeTab === 'star' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">طوبولوجيا النجمة (Topologie en Étoile)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  أشهر طوبولوجيا في الشبكات المحلية المعاصرة: تتصل جميع الأجهزة مباشرة بجهاز وسيط مركزي (Switch أو Hub).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleInvalidPCDirectConnect}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  تجربة ربط حاسوب بحاسوب آخر
                </button>

                <button
                  onClick={handleRunStarTraffic}
                  disabled={starTransmitting}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {starTransmitting ? 'جاري إرسال الحزمة...' : 'إرسال حزمة عبر Switch'}
                </button>
              </div>
            </div>

            {/* Star Canvas */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[360px] flex flex-col justify-between overflow-hidden">
              {/* SVG Connecting Lines to Center Switch (50%, 50%) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {starConnections.includes('pc1') && (
                  <line
                    x1="20%"
                    y1="25%"
                    x2="50%"
                    y2="50%"
                    stroke={starTransmitting && starSender === 'pc1' ? '#00F0FF' : '#0284C7'}
                    strokeWidth="4"
                    className={starTransmitting && starSender === 'pc1' ? 'animate-signal-fast' : ''}
                  />
                )}
                {starConnections.includes('pc2') && (
                  <line
                    x1="80%"
                    y1="25%"
                    x2="50%"
                    y2="50%"
                    stroke={starTransmitting && starSender === 'pc2' ? '#00F0FF' : '#0284C7'}
                    strokeWidth="4"
                    className={starTransmitting && starSender === 'pc2' ? 'animate-signal-fast' : ''}
                  />
                )}
                {starConnections.includes('pc3') && (
                  <line
                    x1="20%"
                    y1="75%"
                    x2="50%"
                    y2="50%"
                    stroke={starTransmitting && starSender === 'pc3' ? '#00F0FF' : '#0284C7'}
                    strokeWidth="4"
                    className={starTransmitting && starSender === 'pc3' ? 'animate-signal-fast' : ''}
                  />
                )}
                {starConnections.includes('printer') && (
                  <line
                    x1="80%"
                    y1="75%"
                    x2="50%"
                    y2="50%"
                    stroke={starTransmitting && starReceiver === 'printer' ? '#34D399' : '#0284C7'}
                    strokeWidth="4"
                    className={starTransmitting && starReceiver === 'printer' ? 'animate-signal-fast' : ''}
                  />
                )}
              </svg>

              {/* Central Switch */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-24 h-16 bg-slate-900 border-2 border-cyan-400 rounded-2xl flex flex-col items-center justify-center p-2 shadow-xl shadow-cyan-500/20">
                  <span className="text-[11px] font-black text-cyan-300">SWITCH</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-1">المحول المركزي</span>
              </div>

              {/* Devices Around Center */}
              {/* PC 1 (Top Left) */}
              <div className="absolute top-[15%] left-[12%] z-20 flex flex-col items-center">
                <button
                  onClick={() => handleConnectStarDevice('pc1')}
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    starConnections.includes('pc1')
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 1</span>
                </button>
                <button
                  onClick={() => handleConnectStarDevice('pc1')}
                  className="mt-1.5 text-[10px] font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                >
                  {starConnections.includes('pc1') ? 'متصل بالمحول ✓' : 'صل بالمحول'}
                </button>
              </div>

              {/* PC 2 (Top Right) */}
              <div className="absolute top-[15%] right-[12%] z-20 flex flex-col items-center">
                <button
                  onClick={() => handleConnectStarDevice('pc2')}
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    starConnections.includes('pc2')
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 2</span>
                </button>
                <button
                  onClick={() => handleConnectStarDevice('pc2')}
                  className="mt-1.5 text-[10px] font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                >
                  {starConnections.includes('pc2') ? 'متصل بالمحول ✓' : 'صل بالمحول'}
                </button>
              </div>

              {/* PC 3 (Bottom Left) */}
              <div className="absolute bottom-[15%] left-[12%] z-20 flex flex-col items-center">
                <button
                  onClick={() => handleConnectStarDevice('pc3')}
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    starConnections.includes('pc3')
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Monitor className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">PC 3</span>
                </button>
                <button
                  onClick={() => handleConnectStarDevice('pc3')}
                  className="mt-1.5 text-[10px] font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                >
                  {starConnections.includes('pc3') ? 'متصل بالمحول ✓' : 'صل بالمحول'}
                </button>
              </div>

              {/* Network Printer (Bottom Right) */}
              <div className="absolute bottom-[15%] right-[12%] z-20 flex flex-col items-center">
                <button
                  onClick={() => handleConnectStarDevice('printer')}
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    starConnections.includes('printer')
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Printer className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">طابعة</span>
                </button>
                <button
                  onClick={() => handleConnectStarDevice('printer')}
                  className="mt-1.5 text-[10px] font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                >
                  {starConnections.includes('printer') ? 'متصلة بالمحول ✓' : 'صل بالمحول'}
                </button>
              </div>
            </div>

            {/* Star alert message */}
            {starAlert && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  starAlert.includes('خطأ')
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                    : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                }`}
              >
                {starAlert.includes('خطأ') ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                )}
                <span>{starAlert}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. SOLO CHALLENGE: "ابنِ شبكتك بنفسك" */}
      {/* ==================================================== */}
      {activeTab === 'challenge' && (
        <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">تحدي مهندس الشبكات المستقل</span>
              <h3 className="text-xl font-black text-white mt-0.5">ابنِ شبكتك بنفسك (Solo Builder Challenge)</h3>
              <p className="text-xs text-slate-300 mt-1">
                المهمة المطلوبة: قم ببناء طوبولوجيا نجمية (Star Topology) مكونة من محول مركزي Switch و3 حواسيب وطابعة شبكية، وتأكد من سلامة الربط.
              </p>
            </div>

            <button
              onClick={handleVerifyChallenge}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              فحص واختبار الشبكة
            </button>
          </div>

          {/* Workbench Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            {/* Center Switch Status */}
            <div className="md:col-span-4 flex items-center justify-center mb-4">
              <div className="p-4 rounded-2xl bg-slate-900 border-2 border-cyan-400 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 font-black">
                  SW
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">المحول المركزي (Switch 8 Ports)</h4>
                  <p className="text-xs text-cyan-300 font-mono">
                    المنافذ المشغولة: {challengeConnected.length} من 4
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Devices to toggle connect */}
            {[
              { id: 'pc1', label: 'حاسوب الإدارة (PC-1)', type: 'pc' },
              { id: 'pc2', label: 'حاسوب المحاسبة (PC-2)', type: 'pc' },
              { id: 'pc3', label: 'حاسوب الاستقبال (PC-3)', type: 'pc' },
              { id: 'printer', label: 'طابعة ليزرية مشتركة', type: 'printer' },
            ].map((dev) => {
              const isAttached = challengeConnected.includes(dev.id);
              return (
                <div
                  key={dev.id}
                  onClick={() => handleChallengeToggle(dev.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between space-y-3 ${
                    isAttached
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                    {dev.type === 'pc' ? <Monitor className="w-6 h-6" /> : <Printer className="w-6 h-6" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{dev.label}</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">كابل RJ45 Cat6</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-md ${
                      isAttached
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAttached ? 'مربوط بالمحول ✓' : 'انقر لتوصيل الكابل'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Challenge Result Banner */}
          {challengeResult && (
            <div
              className={`p-4 rounded-xl border text-sm font-semibold flex items-start gap-3 animate-in fade-in ${
                challengeResult.success
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}
            >
              {challengeResult.success ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p>{challengeResult.msg}</p>
                {challengeResult.success && (
                  <span className="text-xs text-amber-300 font-bold block mt-1">
                    ✓ تم تسجيل 350 نقطة وإضافة شارة "مهندس الطوبولوجيا" إلى حسابك بنجاح!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
