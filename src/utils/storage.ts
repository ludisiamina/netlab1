import { StudentProgress, Badge } from '../types';

const STORAGE_KEY = 'netlab_student_progress_v1';

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge_discover',
    title: 'مستكشف الشبكات',
    titleFr: 'Explorateur de Réseau',
    description: 'إتمام المختبر الأول وفهم أسباب ربط الحواسيب ومفهوم الشبكة المحلية.',
    icon: '🔍',
  },
  {
    id: 'badge_classify',
    title: 'خبير التصنيف',
    titleFr: 'Expert de Classification',
    description: 'إتقان التمييز بين الشبكات السلكية واللاسلكية والامتدادات (LAN / MAN / WAN).',
    icon: '🌐',
  },
  {
    id: 'badge_topology',
    title: 'مهندس الطوبولوجيا',
    titleFr: 'Architecte de Topologies',
    description: 'بناء طوبولوجيات الحافلة (Bus)، الحلقة (Ring)، والنجمة (Star) بنجاح.',
    icon: '📐',
  },
  {
    id: 'badge_architecture',
    title: 'مدير النظم والخوادم',
    titleFr: 'Gestionnaire Client/Serveur',
    description: 'فهم العلاقة الوظيفية وتجربة نموذجي الخادم/العميل والند للند.',
    icon: '⚡',
  },
  {
    id: 'badge_hardware',
    title: 'تقني التجميع والمحولات',
    titleFr: 'Technicien Matériel',
    description: 'تركيب بطاقات الشبكة، وربط الكابلات، وفهم الفرق الجوهري بين Switch وHub.',
    icon: '🛠️',
  },
  {
    id: 'badge_sharing',
    title: 'حارس أمن الموارد',
    titleFr: 'Gardien des Ressources',
    description: 'التحكم في صلاحيات المشاركة (كاملة وقراءة فقط) ومشاركة الطابعات والمجلدات.',
    icon: '📂',
  },
  {
    id: 'badge_expert',
    title: 'مهندس الشبكات الشاب',
    titleFr: 'Jeune Ingénieur Réseau',
    description: 'اجتياز التحدي النهائي الشامل والحصول على شهادة الكفاءة.',
    icon: '🎓',
  },
];

export const initialProgress: StudentProgress = {
  score: 0,
  completedLabs: [],
  badges: [],
  quizScore: undefined,
  studentName: '',
  lastActiveLab: 'lab1',
};

export function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return initialProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    return JSON.parse(raw);
  } catch {
    return initialProgress;
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // LocalStorage full or private browsing
  }
}

export function resetProgress(): StudentProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return initialProgress;
}
