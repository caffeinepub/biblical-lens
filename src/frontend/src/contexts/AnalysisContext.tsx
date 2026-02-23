import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisContextType {
  result: AnalysisResult | null;
  videoDescription: string | null;
  setAnalysis: (result: AnalysisResult, description: string) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [videoDescription, setVideoDescription] = useState<string | null>(null);

  const setAnalysis = (newResult: AnalysisResult, description: string) => {
    setResult(newResult);
    setVideoDescription(description);
  };

  const clearAnalysis = () => {
    setResult(null);
    setVideoDescription(null);
  };

  return (
    <AnalysisContext.Provider value={{ result, videoDescription, setAnalysis, clearAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
