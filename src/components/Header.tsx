import React from 'react';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';

interface HeaderProps {
  mode: 'teacher' | 'student';
  onModeChange: (mode: 'teacher' | 'student') => void;
  stats?: {
    score: number;
    stars: number;
  };
}

export default function Header({ mode, onModeChange, stats }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Mots Croisés Magiques</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {mode === 'student' && stats && (
            <div className="flex items-center space-x-4 bg-white/20 rounded-full px-4 py-2">
              <div className="flex items-center space-x-1">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">{stats.score}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-300">⭐</span>
                <span className="font-semibold">{stats.stars}</span>
              </div>
            </div>
          )}
          
          <div className="flex bg-white/20 rounded-full p-1">
            <button
              onClick={() => onModeChange('teacher')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                mode === 'teacher'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Professeur</span>
            </button>
            <button
              onClick={() => onModeChange('student')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                mode === 'student'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Étudiant</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}