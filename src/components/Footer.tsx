import React from 'react';
import { Network, BookOpen, GraduationCap } from 'lucide-react';
import { AUTHOR_SIGNATURE, CURRICULUM_TAG } from '../types';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 text-slate-400 py-8 px-4 text-center">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Signature */}
        <div className="flex flex-col md:items-start items-center gap-1">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span className="font-black text-slate-200 tracking-wide">NETLAB – مختبر الشبكات الذكي</span>
          </div>
          <p className="text-sm font-semibold text-cyan-300">
            {AUTHOR_SIGNATURE}
          </p>
        </div>

        {/* Curriculum Tag */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span>{CURRICULUM_TAG}</span>
        </div>

        {/* Lesson concept credit */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span>درس الشبكة المحلية (Réseau Local - LAN)</span>
        </div>
      </div>
    </footer>
  );
};
