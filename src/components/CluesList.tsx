import React from 'react';
import { ArrowRight, ArrowDown, CheckCircle } from 'lucide-react';
import { PlacedWord } from '../types';

interface CluesListProps {
  placedWords: PlacedWord[];
  completedWords: Set<string>;
}

export default function CluesList({ placedWords, completedWords }: CluesListProps) {
  const horizontalClues = placedWords.filter(word => word.direction === 'horizontal');
  const verticalClues = placedWords.filter(word => word.direction === 'vertical');
  
  const renderCluesList = (clues: PlacedWord[], direction: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{direction}</h3>
      </div>
      
      <div className="space-y-3">
        {clues.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun mot {direction.toLowerCase()}</p>
        ) : (
          clues.map((word) => (
            <div
              key={word.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                completedWords.has(word.id)
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="bg-purple-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {word.number}
                </span>
                {completedWords.has(word.id) && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 leading-relaxed">{word.clue}</p>
                {completedWords.has(word.id) && (
                  <p className="text-sm font-mono text-green-600 mt-1">
                    ✨ {word.word}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {renderCluesList(horizontalClues, 'Horizontal', <ArrowRight className="w-5 h-5 text-blue-600" />)}
      {renderCluesList(verticalClues, 'Vertical', <ArrowDown className="w-5 h-5 text-purple-600" />)}
    </div>
  );
}