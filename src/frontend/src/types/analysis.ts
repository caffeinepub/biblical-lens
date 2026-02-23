export interface AnalysisResult {
  rating: 'green' | 'yellow' | 'red';
  explanation: string;
  verseReference: string;
  verseText: string;
}
