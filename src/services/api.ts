/**
 * PyFlow API Service
 * Interacts with Supabase Edge Functions for access management and progress sync.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ADMIN_FN = `${SUPABASE_URL}/functions/v1/pyflow-admin`;
const STUDENT_FN = `${SUPABASE_URL}/functions/v1/pyflow-student`;

const BASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
};

// ─── Local token storage ─────────────────────────────────────────────────────

const ADMIN_TOKEN_KEY = 'pyflow_admin_token';
const STUDENT_CODE_KEY = 'pyflow_student_code';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getStoredStudentCode(): string | null {
  return localStorage.getItem(STUDENT_CODE_KEY);
}

export function setStoredStudentCode(code: string): void {
  localStorage.setItem(STUDENT_CODE_KEY, code.toUpperCase());
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string | null;
  student_code: string;
  created_at: string;
  pyflow_unlocked_days: { day_id: number }[];
  pyflow_unlocked_projects: { project_id: string }[];
  pyflow_progress: {
    streak: number;
    last_active_date: string | null;
    completed_days: number[];
    completed_quizzes?: Record<string, boolean>;
    completed_challenges?: Record<string, string>;
    completed_projects: string[];
  }[];
}

export async function adminLogin(password: string): Promise<{ token: string; expires_at: string; admin_name: string; username: string }> {
  const res = await fetch(`${ADMIN_FN}/login`, {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Échec de la connexion admin');
  return data;
}

export async function adminLogout(): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) return;
  await fetch(`${ADMIN_FN}/logout`, {
    method: 'POST',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
  });
  clearStoredAdminToken();
}

export async function fetchStudents(): Promise<Student[]> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/students`, {
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur chargement étudiants');
  return data;
}

export async function createStudent(payload: {
  name: string;
  email?: string;
  student_code: string;
}): Promise<Student> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/students`, {
    method: 'POST',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur création étudiant');
  return data;
}

export async function deleteStudent(studentId: string): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/students/${studentId}`, {
    method: 'DELETE',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur suppression étudiant');
  }
}

export async function updateStudentAccess(
  studentId: string,
  unlockedDays: number[],
  unlockedProjects: string[]
): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/students/${studentId}/access`, {
    method: 'PUT',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
    body: JSON.stringify({ unlocked_days: unlockedDays, unlocked_projects: unlockedProjects }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur mise à jour accès');
}

// ─── Admin accounts management ────────────────────────────────────────────────

export interface AdminAccount {
  id: string;
  username: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
}

export async function fetchAdmins(): Promise<AdminAccount[]> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/admins`, {
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur chargement admins');
  return data;
}

export async function createAdmin(payload: {
  username: string;
  display_name: string;
  password: string;
}): Promise<AdminAccount> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/admins`, {
    method: 'POST',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur création admin');
  return data;
}

export async function updateAdmin(
  adminId: string,
  payload: { password?: string; display_name?: string; is_active?: boolean }
): Promise<AdminAccount> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Non authentifié');
  const res = await fetch(`${ADMIN_FN}/admins/${adminId}`, {
    method: 'PATCH',
    headers: { ...BASE_HEADERS, 'x-admin-token': token },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur mise à jour admin');
  return data;
}

// ─── Student API ──────────────────────────────────────────────────────────────

export interface StudentAccess {
  student: { id: string; name: string; student_code: string };
  unlocked_days: number[];
  unlocked_projects: string[];
}

export async function fetchStudentAccess(studentCode: string): Promise<StudentAccess> {
  // --- MOCK REGISTRATION SUPPORT ---
  const mockUsersStr = localStorage.getItem('pyflow_mock_users');
  if (mockUsersStr) {
    try {
      const mockUsers = JSON.parse(mockUsersStr);
      if (mockUsers[studentCode]) {
        return {
          student: { id: studentCode, name: mockUsers[studentCode].name, student_code: studentCode },
          unlocked_days: mockUsers[studentCode].unlocked_days || [1],
          unlocked_projects: mockUsers[studentCode].unlocked_projects || []
        };
      }
    } catch (e) {}
  }
  // --------------------------------

  const res = await fetch(`${STUDENT_FN}/access`, {
    headers: { ...BASE_HEADERS, 'x-student-code': studentCode },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Identifiants invalides');
  return data;
}

export interface StudentProgress {
  completed_days: number[];
  completed_quizzes: Record<string, boolean>;
  completed_challenges: Record<string, string>;
  completed_projects: string[];
  streak: number;
  last_active_date: string | null;
}

export async function fetchStudentProgress(studentCode: string): Promise<StudentProgress> {
  const res = await fetch(`${STUDENT_FN}/progress`, {
    headers: { ...BASE_HEADERS, 'x-student-code': studentCode },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur chargement progression');
  return data;
}

export async function saveStudentProgress(
  studentCode: string,
  progress: StudentProgress
): Promise<void> {
  const res = await fetch(`${STUDENT_FN}/progress`, {
    method: 'PUT',
    headers: { ...BASE_HEADERS, 'x-student-code': studentCode },
    body: JSON.stringify(progress),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur sauvegarde progression');
  }
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  streak: number;
  completedDaysCount: number;
  completedQuizzesCount: number;
  completedChallengesCount: number;
  score: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const selectQuery = 'id,name,pyflow_progress(streak,completed_days,completed_quizzes,completed_challenges,completed_projects)';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pyflow_students?select=${encodeURIComponent(selectQuery)}`, {
    headers: BASE_HEADERS,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur chargement du classement');

  return (data as any[])
    .filter(s => s.pyflow_progress && s.name !== 'Admin')
    .map(s => {
      // In PostgREST, nested objects might be returned as an object or a single-item array
      const prog = Array.isArray(s.pyflow_progress)
        ? s.pyflow_progress[0]
        : s.pyflow_progress;

      if (!prog) {
        return {
          id: s.id,
          name: s.name,
          streak: 0,
          completedDaysCount: 0,
          completedQuizzesCount: 0,
          completedChallengesCount: 0,
          score: 0,
        };
      }

      const completedDaysCount = Array.isArray(prog.completed_days) ? prog.completed_days.length : 0;
      
      const completedQuizzesCount = typeof prog.completed_quizzes === 'object' && prog.completed_quizzes !== null
        ? Object.keys(prog.completed_quizzes).filter(k => prog.completed_quizzes[k]).length
        : 0;

      const completedChallengesCount = typeof prog.completed_challenges === 'object' && prog.completed_challenges !== null
        ? Object.keys(prog.completed_challenges).length
        : 0;

      // Score formula:
      // - 100 points per completed day
      // - 10 points per correct quiz
      // - 50 points per code challenge
      const score = (completedDaysCount * 100) + (completedQuizzesCount * 10) + (completedChallengesCount * 50);

      return {
        id: s.id,
        name: s.name,
        streak: prog.streak || 0,
        completedDaysCount,
        completedQuizzesCount,
        completedChallengesCount,
        score,
      };
    })
    .sort((a, b) => b.score - a.score || b.streak - a.streak);
}
