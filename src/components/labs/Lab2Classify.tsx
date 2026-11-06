import React, { useState } from 'react';
import {
  Layers,
  Wifi,
  Cable,
  Globe,
  Building,
  School,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab2Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

export const Lab2Classify: React.FC<Lab2Props> = ({ onComplete, onBackToMenu }) => {
  // Section 1: Medium (Wired vs Wireless)
  const [mediumMode, setMediumMode] = useState<'wired' | 'wireless'>('wired');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Section 2: Geographical Scope Matching
  const [geoMatches, setGeoMatches] = useState<{ [sceneId: string]: string | null }>({
    school: null,
    city: null,
    world: null,
  });
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleTransmitTest = () => {
    sound.playPacket();
    setIsTransmitting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTransmitting(false);
      sound.playSuccess();
      if (mediumMode === 'wired') {
        setTestResult('انتقلت الإشارات الكهربائية والضوئية عبر الكابلات السلكية (RJ45/ألياف) بسرعة واستقرار عالي وبأقل قدر من التشويش!');
      } else {
        setTestResult('انتشرت الأمواج الكهرومغناطيسية (Wi-Fi) عبر الهواء في جميع الاتجاهات، مما منح الأجهزة حرية الحركة والمرونة!');
      }
    }, 1500);
  };

  const handleAssignScope = (sceneId: string, scopeType: string) => {
    sound.playConnect();
    setGeoMatches((prev) => ({ ...prev, [sceneId]: scopeType }));
  };

  const isGeoCompleted =
    geoMatches.school === 'LAN' &&
    geoMatches.city === 'MAN' &&
    geoMatches.world === 'WAN';

  const handleFinish = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      sound.playFanfare();
      onComplete(200, 'badge_classify');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
            <span>المختبر الثاني</span>
            <span>•</span>
            <span className="font-mono">Classification des Réseaux</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            تصنيف الشبكات الحاسوبية
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
        message="تُصنف الشبكات حسب معيارين أساسيين في درس الإعلام الآلي: وسيلة الربط (سلكية أو لاسلكية) والامتداد الجغرافي (LAN وMAN وWAN). قم بتجربة وسائط النقل أولاً ثم حل نشاط المطابقة الجغرافي!"
        mood={isGeoCompleted ? 'excited' : 'thinking'}
      />

      {/* PART 1: CLASSIFICATION BY TRANSMISSION MEDIUM */}
      <section className="bg-slate-900/90 border border-teal-800/40 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400">المعيار الأول</span>
            <h2 className="text-xl font-bold text-white">1. حسب وسيلة الربط (Support de Transmission)</h2>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setMediumMode('wired');
                setTestResult(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mediumMode === 'wired'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cable className="w-4 h-4" />
              شبكة سلكية (Wired Network)
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setMediumMode('wireless');
                setTestResult(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mediumMode === 'wireless'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-4 h-4" />
              شبكة لاسلكية (Wireless Network)
            </button>
          </div>
        </div>

        {/* Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                {mediumMode === 'wired' ? 'محاكاة: شبكة سلكية (Réseau Filaire)' : 'محاكاة: شبكة لاسلكية (Réseau Sans fil)'}
              </span>
              <span className="font-mono text-cyan-400 text-[11px]">
                {mediumMode === 'wired' ? 'Physical Media: RJ45 / Coaxial / Fiber' : 'Radiated Media: Wi-Fi 2.4/5GHz Waves'}
              </span>
            </div>

            {/* Stage Canvas */}
            <div className="relative w-full h-[200px] flex items-center justify-between px-6 my-auto">
              {/* PC 1 */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-cyan-400 shadow-md">
                  <span className="font-black text-xl">PC 1</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 mt-2">محطة عمل أ</span>
              </div>

              {/* Center Intermediary (Switch or Wi-Fi Router) */}
              <div className="relative flex flex-col items-center z-10">
                {mediumMode === 'wired' ? (
                  <div className="w-20 h-12 bg-slate-800 border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className={`w-2 h-2 rounded-full ${isTransmitting ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-16 h-16 bg-slate-800 border-2 border-teal-400 rounded-2xl flex items-center justify-center text-teal-300 shadow-lg shadow-teal-500/20">
                    <Wifi className="w-8 h-8" />
                    {/* Animated Radio Waves */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-teal-400/40 animate-ping pointer-events-none" />
                  </div>
                )}
                <span className="text-[11px] font-bold text-slate-300 mt-2">
                  {mediumMode === 'wired' ? 'محول شبكي (Switch)' : 'نقطة وصول (Wi-Fi AP)'}
                </span>
              </div>

              {/* PC 2 / Tablet */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-cyan-400 shadow-md">
                  <span className="font-black text-xl">PC 2</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 mt-2">محطة عمل ب</span>
              </div>

              {/* SVG Connecting lines or Radio Wave visuals */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mediumMode === 'wired' ? (
                  <>
                    <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#0284C7" strokeWidth="4" />
                    <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#0284C7" strokeWidth="4" />
                    {isTransmitting && (
                      <>
                        <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#00F0FF" strokeWidth="4" className="animate-signal-fast" />
                        <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#00F0FF" strokeWidth="4" className="animate-signal-fast" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Dashed wireless path */}
                    <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#14B8A6" strokeWidth="2" strokeDasharray="6 6" />
                    {isTransmitting && (
                      <circle cx="50%" cy="50%" r="50" fill="none" stroke="#2DD4BF" strokeWidth="3" className="animate-ping" />
                    )}
                  </>
                )}
              </svg>
            </div>

            {/* Test Button & Result */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleTransmitTest}
                disabled={isTransmitting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {isTransmitting ? 'جاري بث الإشارة...' : 'اختبار إرسال الإشارة عبر هذه الوسيلة'}
              </button>

              {testResult && (
                <p className="text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex-1">
                  {testResult}
                </p>
              )}
            </div>
          </div>

          {/* Medium Characteristics Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              خصائص {mediumMode === 'wired' ? 'الشبكة السلكية' : 'الشبكة اللاسلكية'}
            </h4>

            {mediumMode === 'wired' ? (
              <div className="space-y-3 text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-1">الوسائط المادية المستخدمة:</span>
                  <p>كابلات الأزواج الملتوية (Twisted Pair - RJ45)، الكابلات المحورية (Coaxial)، والألياف البصرية (Fibre optique).</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">المميزات:</span>
                  <p>سرعة عالية جداً، استقرار الاتصال، حماية ممتازة من التداخلات الكهرومغناطيسية.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">السلبيات:</span>
                  <p>صعوبة تمديد الكابلات، تقييد حركة الأجهزة، تكلفة التوصيل المادي في المساحات الكبيرة.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-teal-400 block mb-1">الوسائط غير المادية المستخدمة:</span>
                  <p>الأمواج الراديوية (Wi-Fi)، البلوتوث (Bluetooth)، والأشعة تحت الحمراء (Infrared).</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">المميزات:</span>
                  <p>مرونة تامة، سهولة ربط الأجهزة الذكية والمحمولة دون الحاجة لكابلات أو حفر في الجدران.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">السلبيات:</span>
                  <p>تأثر الإشارة بالحواجز والجدران، إمكانية التداخل والتشويش، وتتطلب تأمين كلمات مرور قوية.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PART 2: CLASSIFICATION BY GEOGRAPHICAL SCOPE (LAN - MAN - WAN) */}
      <section className="bg-slate-900/90 border border-cyan-800/40 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-cyan-400">المعيار الثاني</span>
          <h2 className="text-xl font-bold text-white">2. حسب الامتداد الجغرافي (Étendue Géographique)</h2>
          <p className="text-xs text-slate-400 mt-1">
            اسحب أو عيّن نوع الشبكة المناسب (LAN / MAN / WAN) لكل بيئة جغرافية من البيئات الثلاث:
          </p>
        </div>

        {/* Scope badges source */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400">أنواع الشبكات المتاحة للاختيار:</span>
          {[
            { id: 'LAN', name: 'LAN (شبكة محلية - Local Area Network)', desc: 'مكتب، مدرسة، قاعة إعلام آلي (أمتار إلى 1 كلم)' },
            { id: 'MAN', name: 'MAN (شبكة إقليمية - Metropolitan Area Network)', desc: 'مدينة، جامعة، مؤسسة متعددة الفروع' },
            { id: 'WAN', name: 'WAN (شبكة واسعة - Wide Area Network)', desc: 'بين المدن والدول وعبر العالم (شبكة الإنترنت)' },
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => {
                sound.playClick();
                setSelectedBadge(scope.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedBadge === scope.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
              }`}
            >
              {scope.name}
            </button>
          ))}
          {selectedBadge && (
            <span className="text-[11px] text-amber-300 mr-auto font-medium">
              اضغط الآن على المربع المناسب بالأسفل لتعيين [{selectedBadge}]
            </span>
          )}
        </div>

        {/* 3 Scenes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scene 1: School Lab */}
          <div
            onClick={() => selectedBadge && handleAssignScope('school', selectedBadge)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              geoMatches.school === 'LAN'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                : geoMatches.school
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 mb-3">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">قاعة إعلام آلي بمؤسسة تربوية</h3>
              <p className="text-xs text-slate-400 mt-1">
                ربط 20 حاسوباً وطابعة داخل حجرة دراسية أو طابق واحد، المسافة لا تتعدى بضع عشرات من الأمتار.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">التصنيف المحدد:</span>
              <span
                className={`font-mono font-black text-sm px-3 py-1 rounded-lg ${
                  geoMatches.school === 'LAN'
                    ? 'bg-emerald-500 text-slate-950'
                    : geoMatches.school
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {geoMatches.school || 'غير محدد'}
              </span>
            </div>
            {geoMatches.school === 'LAN' && (
              <span className="text-[11px] text-emerald-400">✓ صحيح! LAN (شبكة محلية) تغطي مساحة جغرافية محدودة.</span>
            )}
            {geoMatches.school && geoMatches.school !== 'LAN' && (
              <span className="text-[11px] text-rose-400">✗ خطأ! القاعة الدراسية نطاق محلي صغير (LAN).</span>
            )}
          </div>

          {/* Scene 2: City / University Campus */}
          <div
            onClick={() => selectedBadge && handleAssignScope('city', selectedBadge)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              geoMatches.city === 'MAN'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                : geoMatches.city
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400 mb-3">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">مدينة جامعية أو فروع بنك بمدينة</h3>
              <p className="text-xs text-slate-400 mt-1">
                ربط عدة كليات متباعدة في نفس الولاية أو المدينة الجامعية، على امتداد بضعة كيلومترات.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">التصنيف المحدد:</span>
              <span
                className={`font-mono font-black text-sm px-3 py-1 rounded-lg ${
                  geoMatches.city === 'MAN'
                    ? 'bg-emerald-500 text-slate-950'
                    : geoMatches.city
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {geoMatches.city || 'غير محدد'}
              </span>
            </div>
            {geoMatches.city === 'MAN' && (
              <span className="text-[11px] text-emerald-400">✓ صحيح! MAN (شبكة إقليمية أو مدنية) تغطي مساحة مدينة.</span>
            )}
            {geoMatches.city && geoMatches.city !== 'MAN' && (
              <span className="text-[11px] text-rose-400">✗ خطأ! نطاق المدينة أو الحرم الجامعي يمثل MAN.</span>
            )}
          </div>

          {/* Scene 3: World / Internet */}
          <div
            onClick={() => selectedBadge && handleAssignScope('world', selectedBadge)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              geoMatches.world === 'WAN'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                : geoMatches.world
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 mb-3">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">الإنترنت وخريطة الاتصال العالمية</h3>
              <p className="text-xs text-slate-400 mt-1">
                ربط أجهزة وقارات ودول عبر الأقمار الاصطناعية والكابلات البحرية عبر آلاف الكيلومترات.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">التصنيف المحدد:</span>
              <span
                className={`font-mono font-black text-sm px-3 py-1 rounded-lg ${
                  geoMatches.world === 'WAN'
                    ? 'bg-emerald-500 text-slate-950'
                    : geoMatches.world
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {geoMatches.world || 'غير محدد'}
              </span>
            </div>
            {geoMatches.world === 'WAN' && (
              <span className="text-[11px] text-emerald-400">✓ صحيح! WAN (شبكة واسعة) كشبكة الإنترنت تربط العالم بأسره.</span>
            )}
            {geoMatches.world && geoMatches.world !== 'WAN' && (
              <span className="text-[11px] text-rose-400">✗ خطأ! الامتداد الدولي والعالمي هو شبكة واسعة (WAN).</span>
            )}
          </div>
        </div>

        {/* Completion Action */}
        {isGeoCompleted && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle className="w-5 h-5" />
              <span>تهانينا! أتقنت تصنيف الشبكات حسب وسيلة الربط والامتداد الجغرافي.</span>
            </div>

            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 text-sm cursor-pointer hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {isCompleted ? 'تم إكمال المختبر بنجاح ✓' : 'إتمام المختبر وحصد 200 نقطة والشارة'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
