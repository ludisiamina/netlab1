import React, { useState } from 'react';
import {
  Server,
  Monitor,
  Send,
  ArrowRight,
  CheckCircle,
  Database,
  FileText,
  Globe,
  Share2,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab4Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

type ModelType = 'client-server' | 'peer-to-peer' | 'comparison';

export const Lab4Architecture: React.FC<Lab4Props> = ({ onComplete, onBackToMenu }) => {
  const [activeModel, setActiveModel] = useState<ModelType>('client-server');

  // Client-Server Simulation State
  const [activeClient, setActiveClient] = useState<number>(1);
  const [requestType, setRequestType] = useState<string>('file');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [serverLog, setServerLog] = useState<string | null>(null);

  // P2P Simulation State
  const [p2pSource, setP2pSource] = useState<string>('peerA');
  const [p2pTarget, setP2pTarget] = useState<string>('peerB');
  const [p2pSharing, setP2pSharing] = useState<boolean>(false);
  const [p2pLog, setP2pLog] = useState<string | null>(null);

  // Comparison Quiz
  const [compAnswers, setCompAnswers] = useState<{ [qId: string]: string | null }>({
    q1: null,
    q2: null,
    q3: null,
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // ---------------------------------------------
  // CLIENT-SERVER HANDLER
  // ---------------------------------------------
  const handleSendClientRequest = () => {
    sound.playPacket();
    setIsProcessing(true);
    setServerLog(`جاري إرسال الطلب (Request) من الزبون Client-${activeClient} إلى الخادم المركزي...`);

    setTimeout(() => {
      sound.playConnect();
      setServerLog(`الخادم المركزي يعالج الطلب ويوفر الخدمة المطلوبة (${requestType === 'file' ? 'ملف المنهاج' : requestType === 'web' ? 'صفحة الويب' : 'قاعدة البيانات'})...`);
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      sound.playSuccess();
      setServerLog(`تم إرسال الاستجابة (Response) والبيانات بنجاح إلى Client-${activeClient}! الخادم هو المزود الحصري لهذه الخدمة.`);
    }, 2400);
  };

  // ---------------------------------------------
  // P2P HANDLER
  // ---------------------------------------------
  const handleP2pShare = () => {
    if (p2pSource === p2pTarget) {
      sound.playError();
      setP2pLog('عفواً! يجب اختيار جهازين مختلفين للمشاركة.');
      return;
    }
    sound.playPacket();
    setP2pSharing(true);
    setP2pLog(`في نموذج الند للند (P2P): الجهاز [${p2pSource}] يلعب الآن دور الخادم (يقدم الملف)، والجهاز [${p2pTarget}] يلعب دور الزبون (المستلم).`);

    setTimeout(() => {
      setP2pSharing(false);
      sound.playSuccess();
      setP2pLog(`اكتملت المشاركة المباشرة! لاحظ أنه يمكن لأي جهاز أن يعكس أدواره في أي وقت دون حاجة لخادم مركزي.`);
    }, 2200);
  };

  // ---------------------------------------------
  // COMPARISON HANDLER
  // ---------------------------------------------
  const handleCompAnswer = (qId: string, val: string) => {
    sound.playClick();
    setCompAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const isComparisonDone =
    compAnswers.q1 === 'cs' &&
    compAnswers.q2 === 'p2p' &&
    compAnswers.q3 === 'cs';

  const handleFinishLab = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      sound.playFanfare();
      onComplete(200, 'badge_architecture');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <span>المختبر الرابع</span>
            <span>•</span>
            <span className="font-mono">Architecture Fonctionnelle</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            العلاقة الوظيفية: خادم/زبون مقابل الند للند
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
        message="تحدد العلاقة الوظيفية كيفية توزيع المهام والخدمات بين حواسيب الشبكة. في نموذج الخادم/الزبون هناك جهاز قوي مخصص، بينما في الند للند (P2P) جميع الأجهزة متساوية وتتبادل الأدوار. جرب النموذجين معاً!"
        mood={isComparisonDone ? 'excited' : 'happy'}
      />

      {/* Model Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveModel('client-server');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeModel === 'client-server'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          1. نموذج خادم / زبون (Client - Server)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModel('peer-to-peer');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeModel === 'peer-to-peer'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          2. نموذج الند للند (Peer to Peer - P2P)
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModel('comparison');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeModel === 'comparison'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          3. المقارنة والتطبيق
        </button>
      </div>

      {/* ======================================================= */}
      {/* 1. CLIENT-SERVER SIMULATION */}
      {/* ======================================================= */}
      {activeModel === 'client-server' && (
        <div className="bg-slate-900/90 border border-purple-800/40 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">محاكاة نموذج الخادم والزبائن (Client-Serveur)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                الخادم (Serveur) حاسوب ذو مواصفات قوية يقدم الخدمات والموارد، والزبائن (Clients) تطلب تلك الخدمات.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Canvas */}
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[340px] flex flex-col justify-between">
              {/* Server on Left/Top */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3 bg-purple-950/60 border-2 border-purple-500/60 p-3.5 rounded-2xl shadow-lg shadow-purple-950/40">
                  <div className="w-14 h-14 rounded-xl bg-purple-900 flex items-center justify-center text-purple-200">
                    <Server className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded">
                      الخادم المركزي (Serveur)
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Central Server</h4>
                    <span className="text-[11px] text-slate-400 font-mono">IP: 192.168.1.1 (Static)</span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold block">الخدمات النشطة:</span>
                  <span>ملفات • ويب • قواعد بيانات</span>
                </div>
              </div>

              {/* Connecting Lines & Packet animations */}
              <div className="relative my-6 h-28">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[1, 2, 3].map((clientNum) => {
                    const xPercent = 20 + (clientNum - 1) * 30;
                    return (
                      <line
                        key={`c-line-${clientNum}`}
                        x1="25%"
                        y1="10%"
                        x2={`${xPercent}%`}
                        y2="90%"
                        stroke={activeClient === clientNum && isProcessing ? '#A855F7' : '#334155'}
                        strokeWidth="3"
                        className={activeClient === clientNum && isProcessing ? 'animate-signal-fast' : ''}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Clients on Bottom */}
              <div className="grid grid-cols-3 gap-4 z-10">
                {[1, 2, 3].map((cNum) => {
                  const isSelected = activeClient === cNum;
                  return (
                    <button
                      key={cNum}
                      onClick={() => {
                        sound.playClick();
                        setActiveClient(cNum);
                      }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-950/70 border-purple-400 text-purple-200 shadow-lg shadow-purple-900/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Monitor className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold text-white">الزبون Client {cNum}</span>
                      <span className="text-[10px] text-slate-400 font-mono">192.168.1.{10 + cNum}</span>
                    </button>
                  );
                })}
              </div>

              {/* Log notification */}
              {serverLog && (
                <div className="mt-4 p-3 bg-purple-950/80 border border-purple-500/50 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>{serverLog}</span>
                </div>
              )}
            </div>

            {/* Request Control Deck */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2 mb-3">
                  إرسال طلب (Request) من الزبون {activeClient}
                </h4>

                <div className="space-y-3">
                  <label className="text-slate-300 block font-medium">نوع الخدمة المطلوبة من الخادم:</label>
                  <div className="space-y-2">
                    {[
                      { id: 'file', label: 'طلب تحميل ملف (File Server)', icon: FileText },
                      { id: 'web', label: 'طلب صفحة ويب (Web Server)', icon: Globe },
                      { id: 'db', label: 'استعلام قاعدة بيانات (Database)', icon: Database },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => setRequestType(srv.id)}
                        className={`w-full text-right p-2.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                          requestType === srv.id
                            ? 'bg-purple-900/60 border-purple-400 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <srv.icon className="w-4 h-4 text-purple-400" />
                        <span>{srv.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendClientRequest}
                disabled={isProcessing}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isProcessing ? 'جاري معالجة الطلب...' : 'إرسال الطلب إلى الخادم'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. PEER-TO-PEER SIMULATION */}
      {/* ======================================================= */}
      {activeModel === 'peer-to-peer' && (
        <div className="bg-slate-900/90 border border-purple-800/40 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">محاكاة نموذج الند للند (Poste à Poste / Peer-to-Peer)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              لا يوجد خادم مخصص! جميع الحواسيب متكافئة الصلاحيات، وكل جهاز يمكنه أن يكون خادماً أو زبوناً في الوقت نفسه أو بالتناوب.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Canvas */}
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[320px] flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-6 my-auto">
                {[
                  { id: 'peerA', name: 'الحاسوب (أ) - Peer A', shared: 'صور ومستندات' },
                  { id: 'peerB', name: 'الحاسوب (ب) - Peer B', shared: 'فيديوهات تعليمية' },
                  { id: 'peerC', name: 'الحاسوب (ج) - Peer C', shared: 'ملفات صوتية' },
                ].map((peer) => {
                  const isSrc = p2pSource === peer.id;
                  const isDst = p2pTarget === peer.id;
                  return (
                    <div
                      key={peer.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center justify-between transition-all ${
                        isSrc
                          ? 'bg-purple-950/60 border-purple-400 shadow-md shadow-purple-900/40'
                          : isDst
                          ? 'bg-teal-950/60 border-teal-400 shadow-md shadow-teal-900/40'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-purple-300 mb-2">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <h5 className="text-xs font-bold text-white">{peer.name}</h5>
                      <span className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded mt-1 border border-slate-800">
                        خادم وزبون معاً
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2">مجلد: {peer.shared}</p>
                    </div>
                  );
                })}
              </div>

              {p2pLog && (
                <div className="p-3 bg-purple-950/80 border border-purple-500/50 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>{p2pLog}</span>
                </div>
              )}
            </div>

            {/* P2P Controls */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-xs">
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  مشاركة ملف مباشرة بين جهازين
                </h4>

                <div>
                  <label className="text-slate-400 block mb-1">الجهاز المرسل (يلعب دور الخادم مؤقتاً):</label>
                  <select
                    value={p2pSource}
                    onChange={(e) => setP2pSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs"
                  >
                    <option value="peerA">الحاسوب (أ) - Peer A</option>
                    <option value="peerB">الحاسوب (ب) - Peer B</option>
                    <option value="peerC">الحاسوب (ج) - Peer C</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">الجهاز المستلم (يلعب دور الزبون):</label>
                  <select
                    value={p2pTarget}
                    onChange={(e) => setP2pTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs"
                  >
                    <option value="peerB">الحاسوب (ب) - Peer B</option>
                    <option value="peerA">الحاسوب (أ) - Peer A</option>
                    <option value="peerC">الحاسوب (ج) - Peer C</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleP2pShare}
                disabled={p2pSharing}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                {p2pSharing ? 'جاري نقل الملف مباشرة...' : 'بدء المشاركة المباشرة (P2P)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. COMPARISON & ASSESSMENT */}
      {/* ======================================================= */}
      {activeModel === 'comparison' && (
        <div className="bg-slate-900/90 border border-purple-800/40 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">نشاط المقارنة بين النموذجين (حسب مقرر الدرس)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              أجب عن المواقف التالية باختيار النموذج الأنسب:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Q1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-300">
                1. شبكة مؤسسة بنكية تضم 50 موظفاً وتتطلب أماناً عالياً وإدارة مركزية لحسابات المستخدمين:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => handleCompAnswer('q1', 'cs')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q1 === 'cs'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج خادم / زبون (Client-Server)
                </button>
                <button
                  onClick={() => handleCompAnswer('q1', 'p2p')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q1 === 'p2p'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج الند للند (Peer to Peer)
                </button>
              </div>
              {compAnswers.q1 === 'cs' && (
                <span className="text-[11px] text-emerald-400">✓ صحيح! الخادم يوفر إدارة مركزية وحماية قوية للبيانات الحساسة.</span>
              )}
            </div>

            {/* Q2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-300">
                2. ثلاثة أصدقاء في منزل يريدون تبادل بعض الصور دون شراء أجهزة خوادم باهظة الثمن:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => handleCompAnswer('q2', 'p2p')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q2 === 'p2p'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج الند للند (Peer to Peer)
                </button>
                <button
                  onClick={() => handleCompAnswer('q2', 'cs')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q2 === 'cs'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج خادم / زبون (Client-Server)
                </button>
              </div>
              {compAnswers.q2 === 'p2p' && (
                <span className="text-[11px] text-emerald-400">✓ صحيح! الند للند مناسب للشبكات الصغيرة غير المعقدة ومنخفضة التكلفة.</span>
              )}
            </div>

            {/* Q3 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-300">
                3. نظام النسخ الاحتياطي لقاعدة بيانات امتحانات مديرية التربية والتعليم:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => handleCompAnswer('q3', 'cs')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q3 === 'cs'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج خادم / زبون (Client-Server)
                </button>
                <button
                  onClick={() => handleCompAnswer('q3', 'p2p')}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-right ${
                    compAnswers.q3 === 'p2p'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  نموذج الند للند (Peer to Peer)
                </button>
              </div>
              {compAnswers.q3 === 'cs' && (
                <span className="text-[11px] text-emerald-400">✓ صحيح! الحفظ المركزي على خادم مخصص يضمن النسخ الاحتياطي المستمر ومراقبة التراخيص.</span>
              )}
            </div>
          </div>

          {/* Completion button */}
          {isComparisonDone && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleFinishLab}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {isCompleted ? 'تم إكمال المختبر وحصد الشارة ✓' : 'إتمام المختبر وحصد 200 نقطة والشارة'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
