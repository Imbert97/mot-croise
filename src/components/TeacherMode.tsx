import React, { useState } from 'react';
import { Plus, Trash2, Play, Save, BookOpen } from 'lucide-react';
import { Word } from '../types';

interface TeacherModeProps {
  words: Word[];
  onWordsChange: (words: Word[]) => void;
  onStartGame: () => void;
}

export default function TeacherMode({ words, onWordsChange, onStartGame }: TeacherModeProps) {
  const [newWord, setNewWord] = useState('');
  const [newClue, setNewClue] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const addWord = () => {
    if (newWord.trim() && newClue.trim()) {
      const word: Word = {
        id: Date.now().toString(),
        word: newWord.toUpperCase().trim(),
        clue: newClue.trim(),
        difficulty
      };
      onWordsChange([...words, word]);
      setNewWord('');
      setNewClue('');
    }
  };

  const removeWord = (id: string) => {
    onWordsChange(words.filter(w => w.id !== id));
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyEmoji = (diff: string) => {
    switch (diff) {
      case 'easy': return '😊';
      case 'medium': return '🤔';
      case 'hard': return '🤯';
      default: return '😊';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <BookOpen className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Mode Professeur</h2>
        </div>

        {/* Add new word form */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un nouveau mot</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot à deviner
              </label>
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="CHAT"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono uppercase"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="easy">😊 Facile</option>
                <option value="medium">🤔 Moyen</option>
                <option value="hard">🤯 Difficile</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Définition/Indice
            </label>
            <textarea
              value={newClue}
              onChange={(e) => setNewClue(e.target.value)}
              placeholder="Animal domestique qui miaule"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          <button
            onClick={addWord}
            disabled={!newWord.trim() || !newClue.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter le mot</span>
          </button>
        </div>

        {/* Word list */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Mots ajoutés ({words.length})
          </h3>
          
          {words.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Aucun mot ajouté pour le moment</p>
              <p className="text-sm">Commencez par ajouter quelques mots ci-dessus !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl font-bold font-mono text-purple-600">
                          {word.word}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                          {getDifficultyEmoji(word.difficulty)} {word.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-700">{word.clue}</p>
                    </div>
                    <button
                      onClick={() => removeWord(word.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {words.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartGame}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Play className="w-6 h-6" />
              <span className="text-lg font-semibold">Commencer le jeu !</span>
            </button>
            
            <button
              onClick={() => {
                localStorage.setItem('crosswordWords', JSON.stringify(words));
                alert('Mots sauvegardés !');
              }}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Save className="w-6 h-6" />
              <span className="text-lg font-semibold">Sauvegarder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}