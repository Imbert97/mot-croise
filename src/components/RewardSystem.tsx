import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Heart } from 'lucide-react';

interface RewardSystemProps {
  score: number;
  wordsCompleted: number;
  totalWords: number;
  onWordCompleted?: () => void;
}

export default function RewardSystem({ 
  score, 
  wordsCompleted, 
  totalWords, 
  onWordCompleted 
}: RewardSystemProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastScore, setLastScore] = useState(score);
  
  useEffect(() => {
    if (score > lastScore && onWordCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    setLastScore(score);
  }, [score, lastScore, onWordCompleted]);
  
  const progress = totalWords > 0 ? (wordsCompleted / totalWords) * 100 : 0;
  const stars = Math.floor(score / 100);
  
  const getEncouragementMessage = () => {
    if (progress === 100) return "🎉 Fantastique ! Tu as tout réussi !";
    if (progress >= 75) return "🌟 Presque fini ! Tu es extraordinaire !";
    if (progress >= 50) return "💪 Super travail ! Continue comme ça !";
    if (progress >= 25) return "🚀 Tu es sur la bonne voie !";
    return "✨ C'est parti ! Tu peux le faire !";
  };
  
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">
            🎉✨🌟✨🎉
          </div>
        </div>
      )}
      
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(stars, 5) }, (_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-300 fill-current" />
            ))}
            {stars > 5 && (
              <span className="bg-white/20 rounded-full px-2 py-1 text-sm font-bold">
                +{stars - 5}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-300" />
          <span className="font-semibold">{wordsCompleted}/{totalWords}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-300 to-green-400 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm opacity-90">
          {progress.toFixed(0)}% complété
        </p>
      </div>
      
      {/* Encouragement Message */}
      <div className="text-center">
        <p className="font-semibold text-lg animate-pulse">
          {getEncouragementMessage()}
        </p>
      </div>
      
      {/* Bonus Effects */}
      {progress === 100 && (
        <div className="mt-4 text-center animate-bounce">
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-bold text-yellow-300">
            MISSION ACCOMPLIE !
          </p>
        </div>
      )}
    </div>
  );
}