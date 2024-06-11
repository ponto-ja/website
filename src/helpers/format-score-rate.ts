export const formatScoreRate = (scoreRate: number, includeStyle = true) => {
  return new Intl.NumberFormat('pt-BR', {
    style: includeStyle ? 'currency' : undefined,
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(scoreRate);
};
