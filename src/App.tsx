import React, { useState, useEffect } from 'react';
import { LabId, StudentProgress } from './types';
import { loadProgress, saveProgress, resetProgress, ALL_BADGES } from './utils/storage';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroHome } from './components/HeroHome';
import { Lab1Discover } from './components/labs/Lab1Discover';
import { Lab2Classify } from './components/labs/Lab2Classify';
import { Lab3Topology } from './components/labs/Lab3Topology';
import { Lab4Architecture } from './components/labs/Lab4Architecture';
import { Lab5Hardware } from './components/labs/Lab5Hardware';
import { Lab6Sharing } from './components/labs/Lab6Sharing';
import { FinalExam } from './components/assessment/FinalExam';

export default function App() {
  const [currentLab, setCurrentLab] = useState<LabId | 'home'>('home');
  const [progress, setProgress] = useState<StudentProgress>(loadProgress);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLabComplete = (labId: LabId, scoreGain: number, badgeId?: string) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedLabs.includes(labId);
      const newCompleted = alreadyCompleted ? prev.completedLabs : [...prev.completedLabs, labId];
      const newScore = prev.score + (alreadyCompleted ? Math.floor(scoreGain / 3) : scoreGain);

      let newBadges = [...prev.badges];
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        const badgeInfo = ALL_BADGES.find((b) => b.id === badgeId);
        showNotification(`🎉 تم فتح شارة جديدة: ${badgeInfo?.title || 'إنجاز متميز'}! (+${scoreGain} XP)`);
      } else {
        showNotification(`✓ تم تسجيل إنجازك في المختبر بنجاح! (+${alreadyCompleted ? Math.floor(scoreGain / 3) : scoreGain} XP)`);
      }

      return {
        ...prev,
        score: newScore,
        completedLabs: newCompleted,
        badges: newBadges,
      };
    });
  };

  const handleExamComplete = (gradeOutOf20: number, studentName: string) => {
    setProgress((prev) => {
      let newBadges = [...prev.badges];
      if (gradeOutOf20 >= 10 && !newBadges.includes('badge_expert')) {
        newBadges.push('badge_expert');
        showNotification('🎓 مبروك! نلت شارة "مهندس الشبكات الشاب" وشهادة الكفاءة الرسمية!');
      }

      return {
        ...prev,
        score: prev.score + gradeOutOf20 * 20,
        quizScore: gradeOutOf20,
        studentName,
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة النقاط والشارات وإعادة المغامرة من الصفر؟')) {
      const fresh = resetProgress();
      setProgress(fresh);
      setCurrentLab('home');
      showNotification('تمت إعادة تعيين التقدم بنجاح.');
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        currentLab={currentLab}
        score={progress.score}
        badgesCount={progress.badges.length}
        onNavigate={(target) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentLab(target);
        }}
        onResetProgress={handleResetProgress}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs md:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl shadow-cyan-900/50 flex items-center gap-2 border border-cyan-400/50 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentLab === 'home' && (
          <HeroHome
            progress={progress}
            onSelectLab={(labId) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab(labId);
            }}
          />
        )}

        {currentLab === 'lab1' && (
          <Lab1Discover
            onComplete={(gain, badge) => handleLabComplete('lab1', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'lab2' && (
          <Lab2Classify
            onComplete={(gain, badge) => handleLabComplete('lab2', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'lab3' && (
          <Lab3Topology
            onComplete={(gain, badge) => handleLabComplete('lab3', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'lab4' && (
          <Lab4Architecture
            onComplete={(gain, badge) => handleLabComplete('lab4', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'lab5' && (
          <Lab5Hardware
            onComplete={(gain, badge) => handleLabComplete('lab5', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'lab6' && (
          <Lab6Sharing
            onComplete={(gain, badge) => handleLabComplete('lab6', gain, badge)}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}

        {currentLab === 'exam' && (
          <FinalExam
            initialStudentName={progress.studentName}
            onCompleteExam={handleExamComplete}
            onBackToMenu={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentLab('home');
            }}
          />
        )}
      </main>

      {/* Persistent Footer with Pedagogical Credit */}
      <Footer />
    </div>
  );
}
