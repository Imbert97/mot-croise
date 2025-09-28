import { Word, PlacedWord, CrosswordCell } from '../types';

interface GridPosition {
  row: number;
  col: number;
}

export class CrosswordGenerator {
  private grid: string[][];
  private placedWords: PlacedWord[] = [];
  private gridSize = 15;
  
  constructor(private words: Word[]) {
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
  }

  private canPlaceWord(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    if (direction === 'horizontal') {
      if (col + word.length > this.gridSize) return false;
      
      // Check if the word fits and doesn't conflict
      for (let i = 0; i < word.length; i++) {
        const currentCell = this.grid[row][col + i];
        if (currentCell !== '' && currentCell !== word[i]) {
          return false;
        }
      }
      
      // Check boundaries (no adjacent words)
      if (col > 0 && this.grid[row][col - 1] !== '') return false;
      if (col + word.length < this.gridSize && this.grid[row][col + word.length] !== '') return false;
      
    } else {
      if (row + word.length > this.gridSize) return false;
      
      for (let i = 0; i < word.length; i++) {
        const currentCell = this.grid[row + i][col];
        if (currentCell !== '' && currentCell !== word[i]) {
          return false;
        }
      }
      
      if (row > 0 && this.grid[row - 1][col] !== '') return false;
      if (row + word.length < this.gridSize && this.grid[row + word.length][col] !== '') return false;
    }
    
    return true;
  }

  private placeWord(wordObj: Word, row: number, col: number, direction: 'horizontal' | 'vertical', number: number): void {
    const word = wordObj.word;
    
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        this.grid[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        this.grid[row + i][col] = word[i];
      }
    }
    
    this.placedWords.push({
      id: wordObj.id,
      word: wordObj.word,
      clue: wordObj.clue,
      startRow: row,
      startCol: col,
      direction,
      number
    });
  }

  private findIntersections(word1: string, word2: string): Array<{ pos1: number; pos2: number }> {
    const intersections: Array<{ pos1: number; pos2: number }> = [];
    
    for (let i = 0; i < word1.length; i++) {
      for (let j = 0; j < word2.length; j++) {
        if (word1[i] === word2[j]) {
          intersections.push({ pos1: i, pos2: j });
        }
      }
    }
    
    return intersections;
  }

  generateCrossword(): { grid: CrosswordCell[][]; placedWords: PlacedWord[] } {
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
    this.placedWords = [];
    
    if (this.words.length === 0) {
      return { grid: [], placedWords: [] };
    }
    
    // Sort words by length (longer first for better placement)
    const sortedWords = [...this.words].sort((a, b) => b.word.length - a.word.length);
    
    // Place first word horizontally in the center
    const firstWord = sortedWords[0];
    const centerRow = Math.floor(this.gridSize / 2);
    const centerCol = Math.floor((this.gridSize - firstWord.word.length) / 2);
    
    this.placeWord(firstWord, centerRow, centerCol, 'horizontal', 1);
    
    let wordNumber = 2;
    
    // Try to place remaining words
    for (let i = 1; i < sortedWords.length && i < 8; i++) {
      const currentWord = sortedWords[i];
      let placed = false;
      
      // Try to intersect with already placed words
      for (const placedWord of this.placedWords) {
        if (placed) break;
        
        const intersections = this.findIntersections(placedWord.word, currentWord.word);
        
        for (const intersection of intersections) {
          if (placed) break;
          
          const oppositeDirection = placedWord.direction === 'horizontal' ? 'vertical' : 'horizontal';
          
          let newRow: number, newCol: number;
          
          if (placedWord.direction === 'horizontal') {
            // Place current word vertically
            newRow = placedWord.startRow - intersection.pos2;
            newCol = placedWord.startCol + intersection.pos1;
          } else {
            // Place current word horizontally
            newRow = placedWord.startRow + intersection.pos1;
            newCol = placedWord.startCol - intersection.pos2;
          }
          
          if (newRow >= 0 && newCol >= 0 && 
              this.canPlaceWord(currentWord.word, newRow, newCol, oppositeDirection)) {
            this.placeWord(currentWord, newRow, newCol, oppositeDirection, wordNumber);
            wordNumber++;
            placed = true;
            break;
          }
        }
      }
      
      // If couldn't intersect, try to place randomly
      if (!placed && this.placedWords.length < 4) {
        for (let attempts = 0; attempts < 50 && !placed; attempts++) {
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          const row = Math.floor(Math.random() * (this.gridSize - 2)) + 1;
          const col = Math.floor(Math.random() * (this.gridSize - 2)) + 1;
          
          if (this.canPlaceWord(currentWord.word, row, col, direction)) {
            this.placeWord(currentWord, row, col, direction, wordNumber);
            wordNumber++;
            placed = true;
          }
        }
      }
    }
    
    // Convert to CrosswordCell format
    const cellGrid: CrosswordCell[][] = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill(null).map(() => ({
        letter: '',
        isStart: false,
        wordIds: [],
        row: 0,
        col: 0
      }))
    );
    
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        cellGrid[row][col] = {
          letter: this.grid[row][col],
          isStart: false,
          wordIds: [],
          row,
          col
        };
      }
    }
    
    // Mark start positions and add word IDs
    for (const word of this.placedWords) {
      cellGrid[word.startRow][word.startCol].isStart = true;
      cellGrid[word.startRow][word.startCol].number = word.number;
      
      // Add word ID to all cells of the word
      if (word.direction === 'horizontal') {
        for (let i = 0; i < word.word.length; i++) {
          cellGrid[word.startRow][word.startCol + i].wordIds.push(word.id);
        }
      } else {
        for (let i = 0; i < word.word.length; i++) {
          cellGrid[word.startRow + i][word.startCol].wordIds.push(word.id);
        }
      }
    }
    
    return { grid: cellGrid, placedWords: this.placedWords };
  }
}