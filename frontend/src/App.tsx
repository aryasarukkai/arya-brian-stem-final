import React, { useState } from 'react';
import { fetchTriviaQuestion } from './api';
import { TriviaQuestion } from './types';

const App: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [triviaQuestion, setTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await fetchTriviaQuestion(teamName, difficulty);
    console.log(data);
    setTriviaQuestion(data);
    setSelectedAnswer('');
    setShowHint(false);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const handlePlayAgain = () => {
    setTriviaQuestion(null);
    setSelectedAnswer('');
    setShowHint(false);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-semibold mb-8">NBA Trivia</h1>
          {!triviaQuestion ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="teamName" className="block text-gray-700 font-bold mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Trivia
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Question:</h2>
              <p className="mb-4">{triviaQuestion.hint}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[triviaQuestion.option1, triviaQuestion.option2, triviaQuestion.option3, triviaQuestion.option4].map(
                  (option) => (
                    <button
                      key={option}
                      className={`py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        selectedAnswer === option
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
              {!showResult ? (
                <>
                  {!showHint && (
                    <button
                      className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mb-4"
                      onClick={() => setShowHint(true)}
                    >
                      Show Hint
                    </button>
                  )}
                  {showHint && <p className="mb-4">{triviaQuestion.hint}</p>}
                  <button
                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={handleCheckAnswer}
                    disabled={!selectedAnswer}
                  >
                    Check Answer
                  </button>
                </>
              ) : (
                <>
                  {selectedAnswer === triviaQuestion.correctanswer ? (
                    <p className="text-green-600 font-semibold mb-4">Correct!</p>
                  ) : (
                    <p className="text-red-600 font-semibold mb-4">
                      Incorrect. The correct answer is {triviaQuestion.correctanswer}.
                    </p>
                  )}
                  <button
                    className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handlePlayAgain}
                  >
                    Play Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;