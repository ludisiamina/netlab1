import React, { useState } from 'react';
import {
  Share2,
  Folder,
  Printer,
  FileText,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Save,
  ArrowRight,
  Sparkles,
  Eye,
  UserCheck,
  Send,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { NettoMentor } from '../NettoMentor';

interface Lab6Props {
  onComplete: (scoreGain: number, badgeId?: string) => void;
  onBackToMenu: () => void;
}

type PermissionMode = 'readonly' | 'full';

export const Lab6Sharing: React.FC<Lab6Props> = ({ onComplete, onBackToMenu }) => {
  // Folder permissions
  const [permission, setPermission] = useState<PermissionMode>('readonly');
  const [currentUser, setCurrentUser] = useState<'student' | 'admin'>('student');

  // Virtual document state
  const [fileContent, setFileContent] = useState<string>(
    'تقرير مادة الإعلام الآلي: الشبكة المحلية تسمح بمشاركة الموارد وخفض تكاليف شراء العتاد.'
  );
  const [initialContent] = useState<string>(
    'تقرير مادة الإعلام الآلي: الشبكة المحلية تسمح بمشاركة الموارد وخفض تكاليف شراء العتاد.'
  );
  const [isFileDeleted, setIsFileDeleted] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // Printer Sharing state
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printedJob, setPrintedJob] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // ---------------------------------------------
  // FILE ACTIONS
  // ---------------------------------------------
  const handleReadFile = () => {
    sound.playClick();
    setActionFeedback({
      success: true,
      msg: '✓ تم فتح الملف وقراءته بنجاح! القراءة مسموحة في كلا الصلاحيتين (القراءة فقط والتحكم الكامل).',
    });
  };

  const handleSaveEdit = () => {
    if (permission === 'readonly') {
      sound.playError();
      setActionFeedback({
        success: false,
        msg: '✗ تم رفض التعديل! (Access Denied). الصلاحية الحالية هي "قراءة فقط" (Lecture Seule). هذا يمنع أي مستخدم من تغيير محتوى الملف الأصلي لحمايته من العبث.',
      });
    } else {
      sound.playSuccess();
      setActionFeedback({
        success: true,
        msg: '✓ تم حفظ التعديل بنجاح! الصلاحية الكاملة (Contrôle Total) تمنح حق القراءة والتعديل (Modification) وحفظ التغييرات.',
      });
    }
  };

  const handleDeleteFile = () => {
    if (permission === 'readonly') {
      sound.playError();
      setActionFeedback({
        success: false,
        msg: '✗ تم رفض الحذف! (Permission Refused). صلاحية "قراءة فقط" تمنع حذف الملف نهائياً للحفاظ على الوثائق الهامة في المؤسسة.',
      });
    } else {
      sound.playSuccess();
      setIsFileDeleted(true);
      setActionFeedback({
        success: true,
        msg: '✓ تم حذف الملف بنجاح! الصلاحية الكاملة تمنح المستخدم سلطة حذف الملفات (Suppression).',
      });
    }
  };

  const handleRestoreFile = () => {
    sound.playConnect();
    setIsFileDeleted(false);
    setFileContent(initialContent);
    setActionFeedback({
      success: true,
      msg: 'تمت استعادة الملف إلى المجلد المشترك.',
    });
  };

  // ---------------------------------------------
  // PRINTER SHARING
  // ---------------------------------------------
  const handlePrintDocument = (docName: string) => {
    sound.playPacket();
    setIsPrinting(true);
    setPrintedJob(null);

    setTimeout(() => {
      setIsPrinting(false);
      sound.playSuccess();
      setPrintedJob(`تمت طباعة وثيقة [${docName}] بنجاح عبر الطابعة الشبكية المشتركة HP LaserJet!`);
    }, 2200);
  };

  const handleFinishLab = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      sound.playFanfare();
      onComplete(200, 'badge_sharing');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <span>المختبر السادس</span>
            <span>•</span>
            <span className="font-mono">Partage des Ressources</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            مشاركة الموارد والصلاحيات في الشبكة المحلية
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
        message="من أهم فوائد الشبكة المحلية مشاركة الموارد المادية (كالطابعات) والبرمجية (كالمجلدات والملفات). لكن الأمان يتطلب ضبط الصلاحيات: هل نسمح بالقراءة فقط (Lecture seule) أم بالمشاركة الكاملة (Contrôle total)؟ جرب بنفسك في هذا المختبر!"
        mood={actionFeedback?.success ? 'excited' : 'happy'}
      />

      {/* SECTION 1: FOLDER SHARING & PERMISSIONS SIMULATION */}
      <section className="bg-slate-900/90 border border-rose-800/40 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-rose-400">التجربة الأولى</span>
            <h2 className="text-lg font-bold text-white">مشاركة المجلدات والصلاحيات (Dossier Partagé & Permissions)</h2>
          </div>

          {/* Permission Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setPermission('readonly');
                setActionFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                permission === 'readonly'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              مشاركة للقراءة فقط (Lecture seule)
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setPermission('full');
                setActionFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                permission === 'full'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              مشاركة كاملة (Contrôle total)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual File Sandbox (2 cols) */}
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Folder className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  \\Server\مجلد_المستندات_المشترك\مشروع_الشبكات.txt
                </span>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                  permission === 'readonly'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                الصلاحية: {permission === 'readonly' ? 'قراءة فقط (Read-Only)' : 'تحكم كامل (Full Control)'}
              </span>
            </div>

            {/* Document Content View / Editor */}
            {!isFileDeleted ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>محتوى الملف المشترك (يمكنك محاولة الكتابة أو تعديل النص):</span>
                  <span className="text-[10px] font-mono">Encoding: UTF-8</span>
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-sm text-slate-100 font-mono focus:outline-none transition-colors"
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-rose-950/20 border-2 border-dashed border-rose-500/40 rounded-xl space-y-3">
                <Trash2 className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-sm font-bold text-rose-300">تم حذف الملف من المجلد المشترك!</p>
                <button
                  onClick={handleRestoreFile}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  استعادة الملف للتجربة مجدداً
                </button>
              </div>
            )}

            {/* Action Buttons to Test Permissions */}
            {!isFileDeleted && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleReadFile}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  قراءة الملف (Read)
                </button>

                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  حفظ التعديلات (Modify)
                </button>

                <button
                  onClick={handleDeleteFile}
                  className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer mr-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف الملف (Delete)
                </button>
              </div>
            )}

            {/* Action Feedback Message */}
            {actionFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                  actionFeedback.success
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500 text-rose-200'
                }`}
              >
                {actionFeedback.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <span>{actionFeedback.msg}</span>
              </div>
            )}
          </div>

          {/* Curriculum Guide Card (1 col) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              أنواع الصلاحيات في الدرس
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  1. القراءة فقط (Lecture seule):
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  تسمح للمستخدمين بالاطلاع على محتوى الملفات وفتحها ونسخها، لكنها تمنع كلياً تعديل المحتوى أو حفظ أي تغييرات أو حذف الملف.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" />
                  2. المشاركة الكاملة (Contrôle total):
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  تمنح المستخدم كامل الصلاحيات: القراءة (Lecture)، التعديل والتغيير (Modification/Écriture)، والحذف النهائي (Suppression).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
              💡 <strong>سؤال للتفكير:</strong> لماذا نضبط صلاحية وثائق الامتحانات على "قراءة فقط" لمعظم المستخدمين؟ لمنع التعديل غير المرخص وحماية النزاهة!
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRINTER SHARING SIMULATION */}
      <section className="bg-slate-900/90 border border-rose-800/40 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-rose-400">التجربة الثانية</span>
          <h2 className="text-lg font-bold text-white">مشاركة الطابعة في الشبكة (Partage d'imprimante)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بدلاً من شراء طابعة لكل حاسوب، يتم ربط طابعة واحدة بالشبكة لتستقبل أوامر الطباعة من جميع المحطات بالتتابع.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-md">
                <Printer className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">طابعة الشبكة المشتركة (HP LaserJet Pro)</h4>
                <span className="text-[11px] text-slate-400 font-mono">IP: 192.168.1.100 (Shared Queue)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePrintDocument('فرض_المادة_الأول.pdf')}
                disabled={isPrinting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5" />
                {isPrinting ? 'جاري استقبال أمر الطباعة...' : 'إرسال أمر طباعة من الحاسوب PC-2'}
              </button>
            </div>
          </div>

          {/* Active printing visual */}
          {isPrinting && (
            <div className="my-4 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-300 font-semibold">
                طابعة الشبكة تستقبل أمر الطباعة من منفذ الشبكة، وتضعه في قائمة الانتظار (Print Queue)، ثم تقوم بطباعته...
              </span>
            </div>
          )}

          {printedJob && (
            <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{printedJob}</span>
            </div>
          )}
        </div>

        {/* Completion button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinishLab}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            {isCompleted ? 'تم إكمال المختبر وحصد الشارة ✓' : 'إتمام المختبر وحصد 200 نقطة والشارة'}
          </button>
        </div>
      </section>
    </div>
  );
};
