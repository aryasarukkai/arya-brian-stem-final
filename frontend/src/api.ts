import { TriviaQuestion } from './types';

export const fetchTriviaQuestion = async (teamName: string, difficulty: number): Promise<TriviaQuestion> => {
  try {
    const response = await fetch(`https://stemicifinalapi.onrender.com/api/trivia?teamName=${teamName}&difficulty=${difficulty}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trivia question');
    }
    const data = await response.json();
    return data as TriviaQuestion;
  } catch (error) {
    console.error('Error fetching trivia question:', error);
    throw error;
  }
};