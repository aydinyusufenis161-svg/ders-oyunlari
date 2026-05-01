import { v4 as uuidv4 } from 'uuid';
import { getProvider } from './providerFactory.js';
import { buildQuestionPrompt } from '../utils/prompts.js';
import type { ProviderType } from '../types/provider.js';
import type { Question } from '../types/question.js';

export async function generateQuestions(
  provider: ProviderType,
  apiKey: string,
  model: string,
  baseUrl: string | undefined,
  topic: string,
  count: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed',
  mode: string = 'wheel'
): Promise<Question[]> {
  const ai = getProvider(provider);
  const prompt = buildQuestionPrompt(topic, count, difficulty, mode);

  const response = await ai.chat({
    apiKey,
    model,
    systemPrompt: 'Sen bir eğitim sorusu üreticisisin. Sadece JSON formatında yanıt ver.',
    userPrompt: prompt,
    baseUrl,
    temperature: 0.7,
    maxTokens: count * 300,
  });

  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed: unknown[];
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('AI yanıtı geçerli JSON içermiyor.');
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed)) throw new Error('AI yanıtı bir dizi değil.');

  return parsed.map((q: any) => ({
    id: uuidv4(),
    question: q.question,
    type: q.type,
    options: q.options || null,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    difficulty: q.difficulty || 'medium',
  }));
}
