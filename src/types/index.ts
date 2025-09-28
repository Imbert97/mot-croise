export interface Word {
  id: string;
  word: string;
  clue: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CrosswordCell {
  letter: string;
  isStart: boolean;
  number?: number;
  wordIds: string[];
  row: number;
  col: number;
}

export interface PlacedWord {
  id: string;
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical';
  number: number;
}

export interface GameStats {
  wordsCompleted: number;
  totalWords: number;
  score: number;
  streak: number;
  stars: number;
}