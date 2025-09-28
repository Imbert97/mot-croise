import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TeacherMode from './components/TeacherMode';
import StudentMode from './components/StudentMode';
import { Word } from './types';

function App() {
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  const [words, setWords] = useState<Word[]>([]);
  const [stats, setStats] = useState({ score: 0, stars: 0 });

  // Load words from localStorage on component mount
  useEffect(() => {
    const savedWords = localStorage.getItem('crosswordWords');
    if (savedWords) {
      try {
        setWords(JSON.parse(savedWords));
      } catch (error) {
        console.error('Error loading saved words:', error);
      }
    }
  }, []);

  // Save words to localStorage whenever words change
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem('crosswordWords', JSON.stringify(words));
    }
  }, [words]);

  const handleWordsChange = (newWords: Word[]) => {
    setWords(newWords);
  };

  const handleStartGame = () => {
    if (words.length > 0) {
      setMode('student');
    }
  };

  const handleBackToTeacher = () => {
    setMode('teacher');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header
        mode={mode}
        onModeChange={setMode}
        stats={mode === 'student' ? stats : undefined}
      />
      
      <main>
        {mode === 'teacher' ? (
          <TeacherMode
            words={words}
            onWordsChange={handleWordsChange}
            onStartGame={handleStartGame}
          />
        ) : (
          <StudentMode
            words={words}
            onBackToTeacher={handleBackToTeacher}
          />
        )}
      </main>
    </div>
  );
}

export default App;