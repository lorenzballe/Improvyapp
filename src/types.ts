export interface DegreeInfo {
  semitones: number;
  name: string;
  symbol: string;
  frequencyFactor: number; // relative to Tonic (Root C4 = 261.63 Hz)
  color: string;           // CSS color code
  description: string;
  tension: 'stable' | 'moderate' | 'high';
}

export interface QuizState {
  currentRound: number;
  score: number;
  targetDegree: DegreeInfo | null;
  isPlaying: boolean;
  hasGuessed: boolean;
  selectedGuess: string | null;
  isCorrect: boolean | null;
  attempts: number;
}

export interface AnalyticalStat {
  degreeSymbol: string;
  degreeName: string;
  accuracy: number;  // 0 to 100
  responseTimeMs: number;
  errorRate: number; // 0 to 100
}
