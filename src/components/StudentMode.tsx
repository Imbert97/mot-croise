import React, { useState, useEffect } from 'react';
import { RotateCcw, Home, Lightbulb } from 'lucide-react';
import CrosswordGrid from './CrosswordGrid';
import CluesList from './CluesList';
import RewardSystem from './RewardSystem';
import { CrosswordGenerator } from '../utils/crosswordGenerator';
import { Word, CrosswordCell, PlacedWord, GameStats } from '../types';

interface StudentModeProps {
  words: Word[];
  onBackToTeacher: () => void;
}

export default function StudentMode({ words, onBackToTeacher }: StudentModeProps) {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<GameStats>({
    wordsCompleted: 0,
    totalWords: 0,
    score: 0,
    streak: 0,
    stars: 0
  });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    generateNewCrossword();
  }, [words]);

  useEffect(() => {
    checkCompletedWords();
  }, [userAnswers, placedWords]);

  const generateNewCrossword = () => {
    if (words.length === 0) return;
    
    const generator = new CrosswordGenerator(words);
    const result = generator.generateCrossword();
    
    setGrid(result.grid);
    setPlacedWords(result.placedWords);
    setUserAnswers({});
    setCompletedWords(new Set());
    setStats(prev => ({
      ...prev,
      totalWords: result.placedWords.length,
      wordsCompleted: 0
    }));
  };

  const checkCompletedWords = () => {
    const newCompletedWords = new Set<string>();
    
    for (const word of placedWords) {
      let isComplete = true;
      
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'horizontal' ? word.startRow : word.startRow + i;
        const col = word.direction === 'horizontal' ? word.startCol + i : word.startCol;
        const cellKey = `${row}-${col}`;
        
        if (userAnswers[cellKey] !== word.word[i]) {
          isComplete = false;
          break;
        }
      }
      
      if (isComplete) {
        newCompletedWords.add(word.id);
      }
    }

    // Check if new words were completed
    const previouslyCompleted = completedWords.size;
    const nowCompleted = newCompletedWords.size;
    
    if (nowCompleted > previouslyCompleted) {
      const newScore = stats.score + (nowCompleted - previouslyCompleted) * 100;
      setStats(prev => ({
        ...prev,
        wordsCompleted: nowCompleted,
        score: newScore,
        streak: prev.streak + (nowCompleted - previouslyCompleted),
        stars: Math.floor(newScore / 100)
      }));
    }

    setCompletedWords(newCompletedWords);
  };

  const handleCellInput = (row: number, col: number, letter: string) => {
    const cellKey = `${row}-${col}`;
    setUserAnswers(prev => ({
      ...prev,
      [cellKey]: letter
    }));
  };

  const resetGame = () => {
    setUserAnswers({});
    setCompletedWords(new Set());
    setStats(prev => ({
      ...prev,
      wordsCompleted: 0,
      score: 0,
      streak: 0,
      stars: 0
    }));
  };

  const revealHint = () => {
    if (placedWords.length === 0) return;
    
    // Find an incomplete word and reveal one letter
    const incompleteWords = placedWords.filter(word => !completedWords.has(word.id));
    if (incompleteWords.length === 0) return;
    
    const randomWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    
    // Find an empty cell in this word
    for (let i = 0; i < randomWord.word.length; i++) {
      const row = randomWord.direction === 'horizontal' ? randomWord.startRow : randomWord.startRow + i;
      const col = randomWord.direction === 'horizontal' ? randomWord.startCol + i : randomWord.startCol;
      const cellKey = `${row}-${col}`;
      
      if (!userAnswers[cellKey]) {
        setUserAnswers(prev => ({
          ...prev,
          [cellKey]: randomWord.word[i]
        }));
        break;
      }
    }
    
    setShowHint(true);
    setTimeout(() => setShowHint(false), 1500);
  };

  if (words.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mode Étudiant</h2>
          <p className="text-gray-600 mb-6">
            Aucun mot disponible pour créer une grille.
          </p>
          <button
            onClick={onBackToTeacher}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors mx-auto"
          >
            <Home className="w-5 h-5" />
            <span>Retour au mode professeur</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with stats */}
      <div className="mb-6">
        <RewardSystem
          score={stats.score}
          wordsCompleted={stats.wordsCompleted}
          totalWords={stats.totalWords}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Recommencer</span>
        </button>
        
        <button
          onClick={revealHint}
          className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Indice</span>
        </button>
        
        <button
          onClick={onBackToTeacher}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Mode Professeur</span>
        </button>
      </div>

      {/* Hint notification */}
      {showHint && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
          💡 Indice révélé !
        </div>
      )}

      {/* Main game area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crossword grid */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Grille de Mots Croisés
            </h3>
            <CrosswordGrid
              grid={grid}
              placedWords={placedWords}
              onCellInput={handleCellInput}
              userAnswers={userAnswers}
              completedWords={completedWords}
            />
          </div>
        </div>

        {/* Clues */}
        <div className="space-y-6">
          <CluesList
            placedWords={placedWords}
            completedWords={completedWords}
          />
        </div>
      </div>

      {/* Completion celebration */}
      {stats.wordsCompleted === stats.totalWords && stats.totalWords > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-purple-600 mb-2">
              Félicitations !
            </h3>
            <p className="text-gray-700 mb-4">
              Tu as complété tous les mots croisés !
            </p>
            <p className="text-lg font-semibold text-purple-600 mb-6">
              Score final : {stats.score} points ⭐
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={generateNewCrossword}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Nouvelle grille
              </button>
              <button
                onClick={onBackToTeacher}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Mode Professeur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}