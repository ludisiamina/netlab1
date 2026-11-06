import React from 'react';
import { Volume2, VolumeX, Award, RotateCcw, Home, Network } from 'lucide-react';
import { LabId, AUTHOR_SIGNATURE } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentLab: LabId | 'home';
  score: number;
  badgesCount: number;
  onNavigate: (lab: LabId | 'home') => void;
  onResetProgress: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLab,
  score,
  badgesCount,
  onNavigate,
  onResetProgress,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Title & Author Signature */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                NETLAB
              </span>
              <span className="text-[11px] font-medium text-cyan-300 whitespace-nowrap">
                {AUTHOR_SIGNATURE}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentLab === 'home' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab1');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab1' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            1. اكتشف الشبكة
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab2');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab2' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            2. التصنيف
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab3');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab3' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            3. الطوبولوجيا
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab4');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab4' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            4. العمارة الوظيفية
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab5');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab5' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            5. التركيب
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lab6');
            }}
            className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentLab === 'lab6' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            6. مشاركة الموارد
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('exam');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentLab === 'exam'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
            }`}
          >
            الاختبار النهائي
          </button>
        </nav>

        {/* Zone 3: Gamification metrics & controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Points display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-900/60 text-xs font-semibold text-slate-200">
            <span className="text-amber-400">⚡</span>
            <span className="font-mono tabular-nums text-amber-300 font-bold">{score}</span>
            <span className="text-[11px] text-slate-400">نقطة</span>
          </div>

          {/* Badges count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-900/60 text-xs font-semibold text-slate-200">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono tabular-nums text-cyan-300 font-bold">{badgesCount}/7</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="تبديل الصوت"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Reset progress button */}
          <button
            onClick={onResetProgress}
            title="إعادة تعيين التقدم"
            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            aria-label="إعادة تعيين التقدم"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
