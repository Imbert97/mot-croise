import React, { useState, useEffect } from 'react';
import { CrosswordCell, PlacedWord } from '../types';

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  placedWords: PlacedWord[];
  onCellInput: (row: number, col: number, letter: string) => void;
  userAnswers: { [key: string]: string };
  completedWords: Set<string>;
}

export default function CrosswordGrid({ 
  grid, 
  placedWords, 
  onCellInput, 
  userAnswers,
  completedWords 
}: CrosswordGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  
  const getCellKey = (row: number, col: number) => `${row}-${col}`;
  
  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].letter) {
      setSelectedCell({ row, col });
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key.match(/[a-zA-Z]/)) {
      onCellInput(row, col, e.key.toUpperCase());
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      onCellInput(row, col, '');
    }
  };
  
  const getCellClass = (cell: CrosswordCell, row: number, col: number) => {
    const baseClass = "w-8 h-8 border-2 text-center text-sm font-bold transition-all duration-200";
    
    if (!cell.letter) {
      return `${baseClass} bg-gray-900 border-gray-900`;
    }
    
    const cellKey = getCellKey(row, col);
    const userAnswer = userAnswers[cellKey] || '';
    const isCorrect = userAnswer === cell.letter;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    
    // Check if this cell belongs to a completed word
    const belongsToCompletedWord = cell.wordIds.some(wordId => completedWords.has(wordId));
    
    let colorClass = "";
    if (belongsToCompletedWord) {
      colorClass = "bg-green-200 border-green-400 text-green-800";
    } else if (userAnswer) {
      colorClass = isCorrect 
        ? "bg-blue-100 border-blue-300 text-blue-800" 
        : "bg-red-100 border-red-300 text-red-800";
    } else {
      colorClass = "bg-white border-gray-300 text-gray-800 hover:bg-gray-50";
    }
    
    if (isSelected) {
      colorClass += " ring-2 ring-purple-500 ring-offset-1";
    }
    
    return `${baseClass} ${colorClass} cursor-pointer`;
  };
  
  if (!grid.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Aucune grille générée</p>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center">
      <div className="inline-block bg-white p-4 rounded-lg shadow-lg">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={getCellKey(rowIndex, colIndex)}
                className="relative"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                <input
                  type="text"
                  value={userAnswers[getCellKey(rowIndex, colIndex)] || ''}
                  onChange={(e) => onCellInput(rowIndex, colIndex, e.target.value.toUpperCase())}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                  className={getCellClass(cell, rowIndex, colIndex)}
                  maxLength={1}
                  disabled={!cell.letter}
                  style={{ caretColor: 'transparent' }}
                />
                {cell.isStart && cell.number && (
                  <div className="absolute -top-1 -left-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cell.number}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}