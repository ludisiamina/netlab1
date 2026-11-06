import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Layers,
  Compass,
  GitBranch,
  Server,
  Wrench,
  Share2,
  GraduationCap,
  Info,
} from 'lucide-react';
import { LabId, LabMeta, StudentProgress, AUTHOR_SIGNATURE, CURRICULUM_TAG } from '../types';
import { ALL_BADGES } from '../utils/storage';
import { NettoMentor } from './NettoMentor';
import { sound } from '../utils/audio';

interface HeroHomeProps {
  progress: StudentProgress;
  onSelectLab: (lab: LabId) => void;
}

export const LABS_CONFIG: LabMeta[] = [
  {
    id: 'lab1',
    number: 1,
    title: 'اكتشف الشبكة',
    titleFr: 'Découverte du Réseau',
    subtitle: 'ما الذي يربط الأجهزة؟ ولماذا ننشئ شبكة؟',
    description: 'استكشف بيئة تفاعلية لعدة حواسيب، وتعرف على تعريف الشبكة المحلية وأهدافها في تبادل المعطيات ومشاركة الموارد.',
    duration: '10 دقائق',
    xp: 150,
    icon: 'Compass',
    color: 'from-blue-600/30 to-cyan-500/20 border-cyan-500/40',
  },
  {
    id: 'lab2',
    number: 2,
    title: 'تصنيف الشبكات',
    titleFr: 'Classification des Réseaux',
    subtitle: 'حسب وسيلة الربط والامتداد الجغرافي',
    description: 'قارن بين الشبكات السلكية (Wired) واللاسلكية (Wireless)، وتعرف بالأنشطة العملية على LAN وMAN وWAN.',
    duration: '15 دقيقة',
    xp: 200,
    icon: 'Layers',
    color: 'from-emerald-600/30 to-teal-500/20 border-teal-500/40',
  },
  {
    id: 'lab3',
    number: 3,
    title: 'مختبر الطوبولوجيا',
    titleFr: 'Topologies de Réseau',
    subtitle: 'الباص (Bus)، الحلقة (Ring)، والنجمة (Star)',
    description: 'قم ببناء وتوصيل الشبكات عملياً، واختبر مسار الإشارات، وتجنب أخطاء الربط مع تحدي "ابنِ شبكتك بنفسك".',
    duration: '20 دقيقة',
    xp: 350,
    icon: 'GitBranch',
    color: 'from-amber-600/30 to-orange-500/20 border-amber-500/40',
  },
  {
    id: 'lab4',
    number: 4,
    title: 'العلاقة الوظيفية',
    titleFr: 'Architecture Fonctionnelle',
    subtitle: 'خادم/زبون (Client-Server) مقابل الند للند (P2P)',
    description: 'أرسل واستقبل طلبات الشبكة، واكتشف دور الخادم المركزي وكيف تتشارك الأجهزة المتساوية كخادم وزبون بالتناوب.',
    duration: '12 دقيقة',
    xp: 200,
    icon: 'Server',
    color: 'from-purple-600/30 to-indigo-500/20 border-purple-500/40',
  },
  {
    id: 'lab5',
    number: 5,
    title: 'تركيب شبكة محلية',
    titleFr: 'Installation Matérielle',
    subtitle: 'ورشة التجميع الافتراضية واختبار Switch vs Hub',
    description: 'ركّب بطاقات الشبكة NIC والكابلات، واختر الموزع أو المحول، واكتشف سبب تفوق Switch في السرعة والأمان.',
    duration: '15 دقيقة',
    xp: 250,
    icon: 'Wrench',
    color: 'from-cyan-600/30 to-blue-500/20 border-cyan-500/40',
  },
  {
    id: 'lab6',
    number: 6,
    title: 'مشاركة الموارد',
    titleFr: 'Partage des Ressources',
    subtitle: 'صلاحيات المجلدات ومشاركة الطابعات',
    description: 'جرّب مشاركة المجلدات بالصلاحية الكاملة (قراءة/تعديل/حذف) أو القراءة فقط، وأرسل أوامر الطباعة إلى طابعة الشبكة.',
    duration: '12 دقيقة',
    xp: 200,
    icon: 'Share2',
    color: 'from-rose-600/30 to-pink-500/20 border-rose-500/40',
  },
];

export const HeroHome: React.FC<HeroHomeProps> = ({ progress, onSelectLab }) => {
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const completedCount = progress.completedLabs.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 6) * 100));

  const getLabIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-teal-400" />;
      case 'GitBranch':
        return <GitBranch className="w-6 h-6 text-amber-400" />;
      case 'Server':
        return <Server className="w-6 h-6 text-purple-400" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-cyan-300" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-rose-400" />;
      default:
        return <Compass className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-800/40 p-6 md:p-10 shadow-2xl shadow-cyan-950/40">
        {/* Subtle Tech Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Grade / Curriculum Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>{CURRICULUM_TAG}</span>
          </div>

          {/* Main Title & Mandatory Signature */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              <span className="text-cyan-400">NETLAB</span> – مختبر الشبكات الذكي
            </h1>
            <p className="text-lg md:text-xl font-bold text-cyan-300 tracking-wide">
              {AUTHOR_SIGNATURE}
            </p>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              منصة تفاعلية قائمة على المحاكاة البصرية والتجريب العملي لتحويل درس الشبكة المحلية إلى مغامرة حقيقية في بناء وإدارة الشبكات الحاسوبية.
            </p>
          </div>

          {/* Virtual Character Netto Welcoming the Student */}
          <div className="w-full max-w-2xl my-2">
            <NettoMentor
              message="مرحباً بك في مختبر الشبكات، مهمتك اليوم هي بناء شبكة حاسوبية ناجحة! اختر مختبراً لبدء الاستكشاف والتجريب العملي."
              mood="happy"
            />
          </div>

          {/* Start CTA & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onSelectLab('lab1');
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all flex items-center gap-2.5 text-base cursor-pointer hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-current" />
              ابدأ المغامرة
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowBadgesModal(true);
              }}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-bold rounded-xl transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              لوحة الشارات ({progress.badges.length}/7)
            </button>
          </div>

          {/* Progress Strip */}
          <div className="w-full max-w-xl bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>مؤشر إنجاز المختبرات: {completedCount} من 6 مكتملة</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Laboratories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white">المختبرات التعليمية التفاعلية</h2>
            <p className="text-xs text-slate-400 mt-1">
              اختر مختبراً لخوض تجارب المحاكاة وحل المشكلات التفاعلية
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/40 px-3 py-1.5 rounded-lg">
            6 محطات تعليمية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LABS_CONFIG.map((lab) => {
            const isCompleted = progress.completedLabs.includes(lab.id);
            return (
              <div
                key={lab.id}
                className={`relative group bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900 to-emerald-950/20'
                    : 'border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                {/* Lab Top Row */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getLabIcon(lab.icon)}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-cyan-400">المختبر {lab.number}</span>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {lab.title}
                        </h3>
                      </div>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        مكتمل
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {lab.duration}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-300 italic mb-1.5 font-mono dir-ltr text-right">
                    {lab.titleFr}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {lab.description}
                  </p>
                </div>

                {/* Lab Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <span>+{lab.xp} XP</span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectLab(lab.id);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    <span>{isCompleted ? 'إعادة التجربة' : 'دخول المختبر'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Assessment & Certificate Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-900 border border-blue-500/40 p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Award className="w-4 h-4" />
            التحدي الختامي وشهادة الكفاءة
          </div>
          <h3 className="text-2xl font-black text-white">الاختبار النهائي وتقييم المكتسبات</h3>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            اختبار تفاعلي من 10 وضعيات متنوعة (علامة من 20) مع تصحيح فوري للمفاهيم، يمنحك شهادة إنجاز معتمدة باسمك بإشراف الأستاذة أمينة.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onSelectLab('exam');
          }}
          className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
        >
          <GraduationCap className="w-5 h-5" />
          خوض الاختبار النهائي
        </button>
      </section>

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-white">شارات الإنجاز والتميز ({progress.badges.length}/7)</h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {ALL_BADGES.map((b) => {
                const unlocked = progress.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      unlocked
                        ? 'bg-slate-800/90 border-amber-500/40 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="text-3xl shrink-0 p-2 bg-slate-800 rounded-lg">{b.icon}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                          {b.title}
                        </span>
                        {unlocked && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            مفتوحة
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">{b.titleFr}</p>
                      <p className="text-xs text-slate-300 leading-snug">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
