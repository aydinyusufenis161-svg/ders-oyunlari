export function buildQuestionPrompt(
  topic: string,
  count: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed',
  mode: string = 'wheel'
): string {
  const difficultyRule =
    difficulty === 'mixed'
      ? '- Zorluk seviyelerini karıştır: ~%30 easy, ~%50 medium, ~%20 hard'
      : `- Tüm soruların zorluk seviyesi "${difficulty}" olmalı`;

  let typeRule = '';
  if (mode === 'true_false') {
    typeRule = '- Sadece Doğru/Yanlış soruları üret (type = "true_false")';
  } else if (mode === 'short_answer_rush') {
    typeRule = '- Sadece Kısa Cevap soruları üret (type = "short_answer"). Cevaplar kesinlikle 1-3 kelimeyi geçmesin.';
  } else if (mode === 'fps_shooter') {
    typeRule = '- Sadece Çoktan Seçmeli sorular üret (type = "multiple_choice"). FPS oyununda hızlı cevaplamak için.';
  } else {
    typeRule = '- Soru tiplerini karıştır: ~%60 multiple_choice, ~%25 true_false, ~%15 short_answer';
  }

  return `Sen uzman bir eğitim sorusu üreticisisin. "${topic}" konusu hakkında tam olarak ${count} adet soru üret.

SADECE geçerli bir JSON dizisi döndür, başka hiçbir metin ekleme. Her soru nesnesi şu şemaya uymalıdır:

{
  "question": "string (soru metni)",
  "type": "multiple_choice" | "true_false" | "short_answer",
  "options": ["A", "B", "C", "D"] | null,
  "correctAnswer": "string (doğru seçenek veya kısa cevap)",
  "explanation": "string (doğru cevabın kısa açıklaması)",
  "difficulty": "easy" | "medium" | "hard"
}

Kurallar:
${typeRule}
${difficultyRule}
- Sorular gerçeklere dayalı ve eğitici olmalı
- Tüm içerik Türkçe dilinde olmalı
- Çoktan seçmeli sorularda ("multiple_choice") tam olarak 4 seçenek olmalı
- Doğru/Yanlış sorularında ("true_false") options ["Doğru", "Yanlış"] olmalı
- Kısa cevap ("short_answer") soruları özlü bir cevaba sahip olmalı (1-3 kelime)
- JSON dizisi dışında hiçbir şey döndürme`;
}
