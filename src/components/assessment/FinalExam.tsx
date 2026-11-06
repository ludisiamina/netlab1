import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AUTHOR_SIGNATURE, CURRICULUM_TAG } from '../../types';
import { sound } from '../../utils/audio';

interface FinalExamProps {
  onCompleteExam: (gradeOutOf20: number, studentName: string) => void;
  onBackToMenu: () => void;
  initialStudentName?: string;
}

interface Question {
  id: number;
  question: string;
  questionFr?: string;
  type: 'mcq' | 'topology' | 'troubleshoot' | 'scenario';
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'ما هو التعريف الدقيق للشبكة المحلية (LAN) حسب منهاج السنة الأولى ثانوي؟',
    questionFr: 'Définition du Réseau Local (LAN)',
    type: 'mcq',
    options: [
      'مجموعة من الحواسيب والأجهزة المتصلة داخل رقعة جغرافية محدودة لتبادل المعلومات ومشاركة الموارد',
      'برنامج حاسوبي لمعالجة النصوص وتنسيق الجداول فقط',
      'حاسوب محمول واحد متصل بجهاز العرض الرقمي',
      'شبكة عالمية تربط بين قارات العالم كافة',
    ],
    correctIndex: 0,
    explanation:
      'الشبكة المحلية (Local Area Network) تربط أجهزة الحاسوب والملحقات ضمن مساحة محدودة (مكتب، مؤسسة، قاعة) لتبادل البيانات ومشاركة الموارد المادية والبرمجية.',
  },
  {
    id: 2,
    question: 'في أي طوبولوجيا تتصل جميع الحواسيب مباشرة بجهاز وسيط مركزي (Switch أو Hub)؟',
    questionFr: 'Topologie en Étoile (Star)',
    type: 'topology',
    options: [
      'طوبولوجيا الحافلة (Topologie en Bus)',
      'طوبولوجيا النجمة (Topologie en Étoile)',
      'طوبولوجيا الحلقة (Topologie en Anneau)',
      'طوبولوجيا الشبكة المعقدة (Mesh)',
    ],
    correctIndex: 1,
    explanation:
      'طوبولوجيا النجمة (Star) تتميز بوجود محول مركزي (Switch) تتصل به كافة الأجهزة عبر كابلات مستقلة.',
  },
  {
    id: 3,
    question: 'ماذا يحدث للاتصال في طوبولوجيا الحافلة (BUS) إذا حدث انقطاع في الكابل المحوري الرئيسي؟',
    questionFr: 'Panne dans le bus principal',
    type: 'troubleshoot',
    options: [
      'تستمر الشبكة في العمل كالمعتاد دون أي تأثر',
      'يتعطل الحاسوب الأول فقط وتعمل باقي الحواسيب',
      'تتعطل الشبكة بالكامل ويتوقف الاتصال بين جميع الأجهزة',
      'تتحول الشبكة تلقائياً إلى طوبولوجيا الحلقة',
    ],
    correctIndex: 2,
    explanation:
      'في طوبولوجيا الحافلة، الكابل الرئيسي هو شريان الاتصال الوحيد المشترك، وأي قطع فيه يؤدي لانهيار الشبكة بأكملها، وهذا من أبرز عيوبها.',
  },
  {
    id: 4,
    question: 'لماذا يعتبر المحول (Switch) أكثر تطوراً وسرعة وأماناً من الموزع (Hub)؟',
    questionFr: 'Différence entre Switch et Hub',
    type: 'mcq',
    options: [
      'لأن Switch يرسل البيانات فقط إلى المنفذ الخاص بالحاسوب المستهدف، بينما Hub يرسلها لجميع الأجهزة',
      'لأن Switch لا يحتاج إلى كابلات إطلاقاً',
      'لأن Hub مخصص فقط للإنترنت بينما Switch مخصص للطابعات',
      'لأنهما يؤديان نفس الوظيفة تماماً دون أي اختلاف',
    ],
    correctIndex: 0,
    explanation:
      'المحول (Switch) جهاز ذكي يفحص عناوين الأجهزة ويرسل الإشارات إلى وجهتها المقصودة فقط (Unicast)، مما يمنع ازدحام الشبكة والتقاط البيانات غير المصرح بها.',
  },
  {
    id: 5,
    question: 'شبكة حاسوبية تربط كليات جامعة قسنطينة أو وهران المتباعدة عبر أرجاء المدينة، تُصنف على أنها:',
    questionFr: 'Réseau Métropolitain (MAN)',
    type: 'mcq',
    options: [
      'شبكة محلية (LAN)',
      'شبكة إقليمية أو مدنية (MAN - Metropolitan Area Network)',
      'شبكة شخصية (PAN)',
      'شبكة واسعة جداً (WAN)',
    ],
    correctIndex: 1,
    explanation:
      'الشبكة الإقليمية (MAN) تغطي امتداداً جغرافياً بحجم مدينة أو حرم جامعي ممتد لعدة كيلومترات.',
  },
  {
    id: 6,
    question: 'في نموذج "الند للند" (Peer-to-Peer / Poste à Poste)، أي عبارة مما يلي هي الصحيحة؟',
    questionFr: 'Modèle Poste à Poste (P2P)',
    type: 'mcq',
    options: [
      'يوجد خادم رئيسي مخصص يتحكم بجميع العمليات بشكل حصري',
      'كل حاسوب يمكن أن يكون خادماً أو زبوناً في الوقت نفسه أو بالتناوب',
      'لا يمكن للأجهزة تبادل أي ملفات إلا عبر شبكة الإنترنت العالمية',
      'يمنع استخدام كابلات الشبكة في هذا النموذج',
    ],
    correctIndex: 1,
    explanation:
      'في نموذج الند للند، جميع المحطات متكافئة الصلاحيات وتتشارك الأدوار بالتناوب دون الحاجة لخادم مركزي باهظ التكلفة.',
  },
  {
    id: 7,
    question: 'أرادت إدارة ثانوية مشاركة جدول التوقيت الأسبوعي مع التلاميذ، بحيث يمكنهم مطالعته دون إمكانية التعديل عليه أو حذفه. ما هي الصلاحية الواجب تحديدها؟',
    questionFr: 'Permissions: Lecture Seule (Read-Only)',
    type: 'scenario',
    options: [
      'المشاركة الكاملة (Contrôle total)',
      'القراءة فقط (Lecture seule / Read-Only)',
      'صلاحية الحذف والتعديل فقط',
      'إلغاء المشاركة تماماً',
    ],
    correctIndex: 1,
    explanation:
      'صلاحية "قراءة فقط" (Lecture seule) تمنح حق فتح الملف والاطلاع على محتواه، وتمنع تعديله أو حفظ أي تغييرات أو حذفه، مما يحمي الوثائق الرسمية.',
  },
  {
    id: 8,
    question: 'ما هي القطعة العتادية الأساسية التي يجب توفرها في الحاسوب لتمكينه من الاتصال بالشبكة المحلية؟',
    questionFr: 'Carte Réseau (Network Interface Card - NIC)',
    type: 'mcq',
    options: [
      'بطاقة الشبكة (Carte Réseau / NIC)',
      'بطاقة الصوت (Carte Son)',
      'قارئ الأقراص المرنة (Lecteur de disquettes)',
      'المروحة الهوائية للمعالج فقط',
    ],
    correctIndex: 0,
    explanation:
      'بطاقة الشبكة (NIC / Carte Réseau) هي المنفذ الفيزيائي الذي يحول البيانات الرقمية إلى إشارات تنتقل عبر الكابل أو الهواء، وتحمل عنوان MAC فريداً.',
  },
  {
    id: 9,
    question: 'في طوبولوجيا الحلقة (Topologie en Anneau)، كيف تسير البيانات؟',
    questionFr: 'Fonctionnement de la topologie en anneau',
    type: 'topology',
    options: [
      'تنتشر عشوائياً في الهواء',
      'تسير في حلقة مغلقة في اتجاه واحد محدد من حاسوب إلى الذي يليه عبر رمز المرور (Token)',
      'ترسل مباشرة من الحاسوب إلى الطابعة دون المرور بالحواسيب المجاورة',
      'تصل دائماً إلى نقطة نهاية مسدودة (Terminator)',
    ],
    correctIndex: 1,
    explanation:
      'طوبولوجيا الحلقة تشكل دارة مغلقة (Boucle fermée)، حيث تنتقل البيانات باتجاه دائري محدد من جهاز لآخر حتى تصل للهدف.',
  },
  {
    id: 10,
    question: 'ما هي أهم فائدة اقتصادية وتنظيمية لمشاركة الطابعة (Partage d’imprimante) في شبكة محلية؟',
    questionFr: 'Avantages du partage des ressources',
    type: 'scenario',
    options: [
      'خفض تكاليف شراء طابعات متعددة ومشاركة طابعة واحدة متطورة بين جميع العاملين',
      'جعل الطابعة تطبع الأوراق دون حبر وكهرباء',
      'تسريع سرعة معالج الحاسوب بشكل مضاعف',
      'منع المستخدمين من إرسال الملفات لبعضهم البعض',
    ],
    correctIndex: 0,
    explanation:
      'مشاركة الموارد المادية تقلل التكلفة المالية للمؤسسة بشكل هائل، حيث تخدم طابعة واحدة مركزية كل مستخدمي الشبكة بكفاءة.',
  },
];

export const FinalExam: React.FC<FinalExamProps> = ({
  onCompleteExam,
  onBackToMenu,
  initialStudentName = '',
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>(initialStudentName || 'تلميذ السنة الأولى ثانوي');

  const curQ = QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    sound.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [curQ.id]: optIdx }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    // Each question is worth 2 points out of 20
    const gradeOutOf20 = correctCount * 2;
    return { correctCount, gradeOutOf20 };
  };

  const handleSubmitExam = () => {
    const { gradeOutOf20 } = calculateResults();
    setIsSubmitted(true);

    if (gradeOutOf20 >= 16) {
      sound.playFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else if (gradeOutOf20 >= 10) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    onCompleteExam(gradeOutOf20, studentName);
  };

  const handleRetake = () => {
    sound.playClick();
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  const { correctCount, gradeOutOf20 } = calculateResults();

  const getDistinction = (grade: number) => {
    if (grade >= 18) return { text: 'ممتاز مع مرتبة الشرف (Excellent)', color: 'text-amber-300' };
    if (grade >= 16) return { text: 'جيد جداً (Très Bien)', color: 'text-emerald-400' };
    if (grade >= 14) return { text: 'جيد (Bien)', color: 'text-cyan-400' };
    if (grade >= 10) return { text: 'مقبول (Passable)', color: 'text-blue-400' };
    return { text: 'يحتاج إلى مراجعة المفاهيم وإعادة المحاكاة', color: 'text-rose-400' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>الاختبار النهائي الشامل</span>
            <span>•</span>
            <span className="font-mono">Évaluation Finale & Certification</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            اختبار كفاءة الشبكة المحلية وشهادة الإنجاز
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

      {/* BEFORE SUBMISSION: QUESTION FLOW */}
      {!isSubmitted ? (
        <div className="space-y-6">
          {/* Progress bar of 10 questions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">
              السؤال {currentIdx + 1} من {QUESTIONS.length}
            </span>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {QUESTIONS.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIdx(idx);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/40'
                        : isAnswered
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <span className="text-amber-400 font-mono font-bold">
              {Object.keys(selectedAnswers).length}/10 مكتملة
            </span>
          </div>

          {/* Current Question Card */}
          <div className="bg-slate-900/95 border border-cyan-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 block font-mono">
                {curQ.questionFr}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {curQ.id}. {curQ.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {curQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[curQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{option}</span>
                    </div>

                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => {
                  sound.playClick();
                  setCurrentIdx((prev) => prev - 1);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                السابق
              </button>

              {currentIdx < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentIdx((prev) => prev + 1);
                  }}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                >
                  السؤال التالي
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={Object.keys(selectedAnswers).length < QUESTIONS.length}
                  className="px-7 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  تسليم ورقة الاختبار وعرض النتيجة
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* AFTER SUBMISSION: RESULTS, CORRECTIONS & OFFICIAL CERTIFICATE */
        <div className="space-y-8 animate-in fade-in">
          {/* Result Score Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-2xl">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              نتيجة تقييم مكتسبات الشبكة المحلية
            </span>

            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl md:text-7xl font-black text-white font-mono tabular-nums">
                {gradeOutOf20}
              </span>
              <span className="text-2xl md:text-3xl font-black text-cyan-400">/ 20</span>
            </div>

            <p className={`text-lg font-bold ${getDistinction(gradeOutOf20).color}`}>
              التقدير: {getDistinction(gradeOutOf20).text}
            </p>

            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              أجبت على {correctCount} من أصل 10 أسئلة بشكل صحيح. لقد قمت بمراجعة كافة محاور درس الشبكة المحلية.
            </p>

            {/* Student Name input for certificate */}
            <div className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row items-center gap-2">
              <label className="text-xs text-slate-400 whitespace-nowrap">اسم التلميذ(ة):</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسمك الكامل لطباعة الشهادة"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white text-xs px-3 py-2 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* ======================================================= */}
          {/* OFFICIAL CERTIFICATE OF ACHIEVEMENT */}
          {/* ======================================================= */}
          <div
            id="certificate-print-area"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/60 p-8 md:p-12 shadow-2xl text-center space-y-6"
          >
            {/* Certificate Decorative Border */}
            <div className="absolute inset-3 border border-amber-500/20 rounded-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 block font-mono">NETLAB – SMART NETWORK LAB</span>
                <span className="text-[11px] text-slate-400">{CURRICULUM_TAG}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Award className="w-7 h-7" />
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 py-4">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                شهادة كفاءة وتميز في الإعلام الآلي
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                شهادة إنجاز في هندسة الشبكات المحلية
              </h2>
              <p className="text-sm text-slate-300">تُمنح هذه الشهادة بكل فخر للتلميذ(ة):</p>
              <p className="text-2xl md:text-3xl font-black text-amber-300 underline decoration-amber-500/40 underline-offset-8">
                {studentName || 'تلميذ السنة الأولى ثانوي'}
              </p>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
                تقديرًا لاجتيازه بنجاح جميع مختبرات المحاكاة التفاعلية (الطوبولوجيات، العلاقة الوظيفية، تركيب العتاد، ومشاركة الموارد)، وتحقيقه علامة:
              </p>
              <div className="inline-block px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xl font-black">
                {gradeOutOf20} / 20 ({getDistinction(gradeOutOf20).text})
              </div>
            </div>

            {/* Mandatory Pedagogical Signature in Certificate */}
            <div className="pt-6 border-t border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-right">
                <span className="text-slate-400 block">الهوية البيداغوجية والإشراف:</span>
                <span className="font-black text-base text-cyan-300">{AUTHOR_SIGNATURE}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  طباعة الشهادة الرسمية
                </button>
              </div>
            </div>
          </div>

          {/* DETAILED PEDAGOGICAL CORRECTION OF ALL 10 QUESTIONS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  التصحيح النموذجي والتغذية الراجعة لجميع الأسئلة
                </h3>
              </div>
              <button
                onClick={handleRetake}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة المحاولة
              </button>
            </div>

            <div className="space-y-4">
              {QUESTIONS.map((q) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-rose-950/20 border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white text-sm">
                        {q.id}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold shrink-0">
                          <CheckCircle className="w-4 h-4" />
                          إجابة صحيحة (+2)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold shrink-0">
                          <XCircle className="w-4 h-4" />
                          إجابة غير صحيحة (0)
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-300">
                      {!isCorrect && userAns !== undefined && (
                        <p className="text-rose-400">
                          <strong>إجابتك:</strong> {q.options[userAns]}
                        </p>
                      )}
                      <p className="text-emerald-400">
                        <strong>الإجابة النموذجية:</strong> {q.options[q.correctIndex]}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
                      💡 <strong>التفسير العلمي:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
