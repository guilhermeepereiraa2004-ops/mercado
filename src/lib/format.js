export const currency = (value = 0) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', minimumFractionDigits: 2,
}).format(Number(value) || 0);

export const shortDate = (value) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date(value));

export const shortTime = (value) => new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit',
}).format(new Date(value));

export const orderAge = (value) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  return shortDate(value);
};
