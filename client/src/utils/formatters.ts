export function formatScore(score: number): string {
  return score.toLocaleString('tr-TR');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatProgress(current: number, total: number): string {
  return `${current}/${total} soru`;
}
