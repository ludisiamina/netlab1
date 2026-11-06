import React, { useState } from 'react';
import {
  Wrench,
  Monitor,
  Cpu,
  Cable,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab5Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

export const Lab5Hardware: React.FC<Lab5Props> = ({ onComplete, onBackToMenu }) => {
  // Assembly Steps
  // 1. Install NIC on PC1
  // 2. Install NIC on PC2
  // 3. Choose Concentrator (Switch / Hub)
  // 4. Connect Cable PC1 -> Concentrator
  // 5. Connect Cable PC2 -> Concentrator

  const [hasNicPC1, setHasNicPC1] = useState(false);
  const [hasNicPC2, setHasNicPC2] = useState(false);
  const [concentrator, setConcentrator] = useState<'switch' | 'hub' | null>(null);
  const [cablePC1, setCablePC1] = useState(false);
  const [cablePC2, setCablePC2] = useState(false);

  // Ping test
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  // Hub vs Switch Demonstration
  const [demoDevice, setDemoDevice] = useState<'hub' | 'switch'>('switch');
  const [demoTransmitting, setDemoTransmitting] = useState(false);
  const [demoLog, setDemoLog] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const isAssemblyComplete =
    hasNicPC1 && hasNicPC2 && concentrator !== null && cablePC1 && cablePC2;

  const handleRunPingTest = () => {
    if (!isAssemblyComplete) {
      sound.playError();
      return;
    }
    sound.playPacket();
    setIsTestingPing(true);
    setPingResult(null);

    setTimeout(() => {
      sound.playSuccess();
      setIsTestingPing(false);
      setPingResult(
        `✓ نجاح الاتصال! (Ping Reply 192.168.1.2: bytes=32 time<1ms TTL=64). أضواء LED خضراء، بطاقات الشبكة تعمل، وتدفقت البيانات بسلاسة عبر ${
          concentrator === 'switch' ? 'المحول Switch' : 'الموزع Hub'
        }.`
      );
    }, 2000);
  };

  const handleRunHubSwitchDemo = () => {
    sound.playPacket();
    setDemoTransmitting(true);
    setDemoLog(null);

    setTimeout(() => {
      setDemoTransmitting(false);
      sound.playSuccess();
      if (demoDevice === 'switch') {
        setDemoLog(
          '✓ سلوك المحول (Switch): فحص عنوان MAC الهدف وأرسل الحزمة حصرياً إلى منفذ الحاسوب المستهدف فقط! هذا يوفر سرعة عالية وأماناً، ويمنع تصادم البيانات (Collisions).'
        );
      } else {
        setDemoLog(
          '⚠ سلوك الموزع (Hub): قام بنسخ الحزمة وإرسالها بشكل أعمى (Diffusion / Broadcast) إلى جميع المنافذ والحواسيب بلا استثناء! هذا يسبب بطء الشبكة وازدحامها ويزيد خطر التصادم.'
        );
      }
    }, 2000);
  };

  const handleFinishLab = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      sound.playFanfare();
      onComplete(250, 'badge_hardware');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
            <span>المختبر الخامس</span>
            <span>•</span>
            <span className="font-mono">Installation et Matériel Réseau</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            ورشة تركيب شبكة محلية ومقارنة Switch مع Hub
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

      <NettoMentor
        message="في هذه الورشة التقنية، ستقوم بتركيب المكونات المادية للشبكة المحلية خطوة بخطوة: بطاقة الشبكة (Carte Réseau / NIC)، كابلات RJ45، واختيار الموزع Hub أو المحول Switch. لاحظ الفرق الجوهري في الذكاء والسرعة بينهما!"
        mood={isAssemblyComplete ? 'excited' : 'happy'}
      />

      {/* SECTION 1: HARDWARE ASSEMBLY WORKBENCH */}
      <section className="bg-slate-900/90 border border-cyan-800/40 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-cyan-400">الجزء التطبيقي</span>
            <h2 className="text-lg font-bold text-white">ورشة التجميع الافتراضية (Virtual Assembly Workbench)</h2>
          </div>

          {/* Assembly progress bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">حالة التجميع:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {[hasNicPC1, hasNicPC2, concentrator !== null, cablePC1, cablePC2].filter(Boolean).length}/5 خطوات
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbox Shelf (1 col) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">
              رف المكونات والعتاد (Components Shelf)
            </h4>

            {/* Component 1: NIC for PC1 */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-bold text-white">بطاقة شبكة للحاسوب 1</span>
              </div>
              <p className="text-[11px] text-slate-400">Carte Réseau PCI (NIC RJ45)</p>
              <button
                onClick={() => {
                  sound.playConnect();
                  setHasNicPC1(!hasNicPC1);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasNicPC1
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {hasNicPC1 ? 'تم التركيب بنجاح ✓' : 'تركيب في PC-1'}
              </button>
            </div>

            {/* Component 2: NIC for PC2 */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-bold text-white">بطاقة شبكة للحاسوب 2</span>
              </div>
              <p className="text-[11px] text-slate-400">Carte Réseau PCI (NIC RJ45)</p>
              <button
                onClick={() => {
                  sound.playConnect();
                  setHasNicPC2(!hasNicPC2);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasNicPC2
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {hasNicPC2 ? 'تم التركيب بنجاح ✓' : 'تركيب في PC-2'}
              </button>
            </div>

            {/* Component 3: Concentrator selection */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white block">جهاز الربط المركزي:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    sound.playClick();
                    setConcentrator('switch');
                  }}
                  className={`py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                    concentrator === 'switch'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-700'
                  }`}
                >
                  Switch (موصى به)
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setConcentrator('hub');
                  }}
                  className={`py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                    concentrator === 'hub'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-700'
                  }`}
                >
                  Hub (موزع)
                </button>
              </div>
            </div>

            {/* Component 4 & 5: Cables */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white block">كابلات الشبكة (RJ45):</span>
              <button
                disabled={!hasNicPC1 || !concentrator}
                onClick={() => {
                  sound.playConnect();
                  setCablePC1(!cablePC1);
                }}
                className={`w-full py-1.5 rounded text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 ${
                  cablePC1
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {cablePC1 ? 'كابل PC-1 موصول ✓' : 'توصيل كابل PC-1'}
              </button>
              <button
                disabled={!hasNicPC2 || !concentrator}
                onClick={() => {
                  sound.playConnect();
                  setCablePC2(!cablePC2);
                }}
                className={`w-full py-1.5 rounded text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 ${
                  cablePC2
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {cablePC2 ? 'كابل PC-2 موصول ✓' : 'توصيل كابل PC-2'}
              </button>
            </div>
          </div>

          {/* Workbench Center Viewport (3 cols) */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative min-h-[380px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-xs z-10">
              <span className="font-bold text-slate-300">طاولة التجميع والتركيب (Assembly Table)</span>
              <span className="text-cyan-400 font-mono text-[11px]">
                {isAssemblyComplete ? '● LINK ACTIVE (1000 Mbps Full-Duplex)' : '○ DISCONNECTED / INCOMPLETE'}
              </span>
            </div>

            {/* Visual Assembly Stage */}
            <div className="relative w-full h-[240px] my-auto flex items-center justify-between px-10">
              {/* PC 1 */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                    hasNicPC1
                      ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <Monitor className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold">حاسوب 1 (PC-1)</span>
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      hasNicPC1 ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {hasNicPC1 ? 'بطاقة NIC مثبتة' : 'بدون بطاقة شبكة'}
                  </span>
                  {cablePC1 && (
                    <span className="text-[9px] text-emerald-400 block mt-1 font-mono">
                      LED: ON (Green Link)
                    </span>
                  )}
                </div>
              </div>

              {/* Central Concentrator (Switch or Hub) */}
              <div className="flex flex-col items-center z-10">
                {concentrator ? (
                  <div
                    className={`w-28 h-18 rounded-2xl border-2 flex flex-col items-center justify-center p-2 shadow-xl ${
                      concentrator === 'switch'
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                        : 'bg-slate-900 border-amber-400 text-amber-300 shadow-amber-500/20'
                    }`}
                  >
                    <span className="text-xs font-black tracking-wider">
                      {concentrator === 'switch' ? 'SWITCH محول' : 'HUB موزع'}
                    </span>
                    <div className="flex gap-1.5 mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cablePC1 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${cablePC2 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-18 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs text-center p-2">
                    اختر المحول أو الموزع
                  </div>
                )}
                <span className="text-[11px] font-bold text-slate-300 mt-2">
                  {concentrator === 'switch' ? 'المحول (أكثر تطوراً)' : concentrator === 'hub' ? 'الموزع (بسيط)' : 'جهاز الربط'}
                </span>
              </div>

              {/* PC 2 */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                    hasNicPC2
                      ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <Monitor className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold">حاسوب 2 (PC-2)</span>
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      hasNicPC2 ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {hasNicPC2 ? 'بطاقة NIC مثبتة' : 'بدون بطاقة شبكة'}
                  </span>
                  {cablePC2 && (
                    <span className="text-[9px] text-emerald-400 block mt-1 font-mono">
                      LED: ON (Green Link)
                    </span>
                  )}
                </div>
              </div>

              {/* SVG Connecting Cables */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {cablePC1 && (
                  <line
                    x1="22%"
                    y1="50%"
                    x2="50%"
                    y2="50%"
                    stroke={isTestingPing ? '#00F0FF' : '#0284C7'}
                    strokeWidth="4"
                    className={isTestingPing ? 'animate-signal-fast' : ''}
                  />
                )}
                {cablePC2 && (
                  <line
                    x1="50%"
                    y1="50%"
                    x2="78%"
                    y2="50%"
                    stroke={isTestingPing ? '#00F0FF' : '#0284C7'}
                    strokeWidth="4"
                    className={isTestingPing ? 'animate-signal-fast' : ''}
                  />
                )}
              </svg>
            </div>

            {/* Test Action & Results */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRunPingTest}
                disabled={!isAssemblyComplete || isTestingPing}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer disabled:opacity-40 shadow"
              >
                <Zap className="w-4 h-4 fill-current" />
                {isTestingPing ? 'جاري فحص الاتصال (Ping)...' : 'اختبار تشغيل الشبكة (Ping Test)'}
              </button>

              {pingResult && (
                <p className="text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 p-2.5 rounded-xl flex-1 animate-in fade-in">
                  {pingResult}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SWITCH VS HUB INTERACTIVE COMPARISON */}
      <section className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400">مفهوم أساسي في المنهاج</span>
            <h3 className="text-lg font-bold text-white">الفرق الجوهري بين المحول (Switch) والموزع (Hub)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ورد في الدرس بوضوح: <strong className="text-cyan-300">«المحول Switch أكثر تطوراً وسرعة وأماناً من الموزع Hub»</strong>. جرّب المحاكاة لرؤية الفرق العملي بنفسك!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setDemoDevice('switch');
                setDemoLog(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                demoDevice === 'switch' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              المحول (Switch)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDemoDevice('hub');
                setDemoLog(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                demoDevice === 'hub' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              الموزع (Hub)
            </button>
          </div>
        </div>

        {/* Interactive Comparison Demonstration Canvas */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative min-h-[260px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">
              سيناريو: الحاسوب (A) يرسل ملفاً خاصاً بالحاسوب (C) فقط
            </span>
            <button
              onClick={handleRunHubSwitchDemo}
              disabled={demoTransmitting}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {demoTransmitting ? 'جاري محاكاة المسار...' : 'إرسال الحزمة ومعاينة المسار'}
            </button>
          </div>

          <div className="relative w-full h-[140px] my-auto flex items-center justify-around px-4">
            {/* Sender Node A */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-950 border-2 border-blue-400 rounded-xl flex items-center justify-center text-blue-200">
                <span className="font-black text-sm">PC A</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-bold">المرسل</span>
            </div>

            {/* Central Device */}
            <div className="flex flex-col items-center">
              <div
                className={`w-20 h-14 rounded-xl border-2 flex items-center justify-center font-black text-xs ${
                  demoDevice === 'switch'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                    : 'bg-amber-950 border-amber-400 text-amber-300'
                }`}
              >
                {demoDevice === 'switch' ? 'SWITCH' : 'HUB'}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {demoDevice === 'switch' ? 'محول ذكي (Unicast)' : 'موزع غبي (Broadcast)'}
              </span>
            </div>

            {/* Receiver Node B (Unintended) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xs font-black ${
                  demoTransmitting && demoDevice === 'hub'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span>PC B</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">غير معني</span>
            </div>

            {/* Receiver Node C (Intended Target) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xs font-black ${
                  demoTransmitting
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span>PC C</span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 font-bold">الهدف المطلوب</span>
            </div>
          </div>

          {demoLog && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
                demoDevice === 'switch'
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                  : 'bg-amber-950/80 border-amber-500 text-amber-200'
              }`}
            >
              {demoDevice === 'switch' ? (
                <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              )}
              <span>{demoLog}</span>
            </div>
          )}
        </div>

        {/* Completion button */}
        {isAssemblyComplete && pingResult && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleFinishLab}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {isCompleted ? 'تم إكمال المختبر وحصد الشارة ✓' : 'إتمام المختبر وحصد 250 نقطة والشارة'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
