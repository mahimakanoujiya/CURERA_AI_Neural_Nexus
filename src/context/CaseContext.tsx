import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { Case, Role, PatientAnswer } from '@/types';
import { createCaseFromInput, acceptCase, requestMoreInfo, scheduleAppointment, markUnderReview, savePatientAnswers } from '@/services/caseService';
import { createDemoCases } from '@/services/demoData';
import { useAuth } from '@/context/AuthContext';

interface CaseContextValue {
  cases: Case[];
  role: Role;
  setRole: (role: Role) => void;
  addCase: (input: string, inputType: 'voice' | 'text', consentGiven?: boolean) => Promise<Case>;
  getCase: (id: string) => Case | undefined;
  acceptCaseById: (id: string) => void;
  requestMoreInfoById: (id: string, message: string) => void;
  scheduleAppointmentById: (id: string, date: string, time: string, type: string, note?: string) => void;
  markUnderReviewById: (id: string) => void;
  savePatientAnswersById: (id: string, answers: PatientAnswer[]) => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

const STORAGE_KEY = 'curera_cases_v4';
const ROLE_KEY = 'curera_role_v1';

export function CaseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [role, setRoleState] = useState<Role>('patient');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedRole = localStorage.getItem(ROLE_KEY) as Role | null;
      if (stored) {
        const parsed = JSON.parse(stored) as Case[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCases(parsed);
        } else {
          createDemoCases().then((demo) => setCases(demo));
        }
      } else {
        createDemoCases().then((demo) => setCases(demo));
      }
      if (storedRole) setRoleState(storedRole);
    } catch {
      createDemoCases().then((demo) => setCases(demo));
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    }
  }, [cases, initialized]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem(ROLE_KEY, r);
  }, []);

  const addCase = useCallback(async (input: string, inputType: 'voice' | 'text', consentGiven: boolean = true) => {
    const newCase = await createCaseFromInput(input, inputType, user?.email ?? null, consentGiven);
    setCases((prev) => [newCase, ...prev]);
    return newCase;
  }, [user?.email]);

  const getCase = useCallback((id: string) => cases.find((c) => c.id === id), [cases]);

  const acceptCaseById = useCallback((id: string) => {
    setCases((prev) => prev.map((c) => (c.id === id ? acceptCase(c) : c)));
  }, []);

  const requestMoreInfoById = useCallback((id: string, message: string) => {
    setCases((prev) => prev.map((c) => (c.id === id ? requestMoreInfo(c, message) : c)));
  }, []);

  const scheduleAppointmentById = useCallback(
    (id: string, date: string, time: string, type: string, note?: string) => {
      setCases((prev) => prev.map((c) => (c.id === id ? scheduleAppointment(c, date, time, type, note) : c)));
    },
    []
  );

  const markUnderReviewById = useCallback((id: string) => {
    setCases((prev) => prev.map((c) => (c.id === id ? markUnderReview(c) : c)));
  }, []);

  const savePatientAnswersById = useCallback((id: string, answers: PatientAnswer[]) => {
    setCases((prev) => prev.map((c) => (c.id === id ? savePatientAnswers(c, answers) : c)));
  }, []);

  return (
    <CaseContext.Provider
      value={{
        cases,
        role,
        setRole,
        addCase,
        getCase,
        acceptCaseById,
        requestMoreInfoById,
        scheduleAppointmentById,
        markUnderReviewById,
        savePatientAnswersById,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCases must be used within CaseProvider');
  return ctx;
}

export function useMyCases() {
  const { cases } = useCases();
  const { user } = useAuth();
  if (!user?.email) return [];
  return cases.filter((c) => c.userEmail === user.email);
}
