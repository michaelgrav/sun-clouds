const normalize = (value?: string | null) => value?.toLowerCase() ?? '';

const extractIconCode = (iconUrl?: string | null) => {
  if (!iconUrl) {
    return '';
  }

  const lastSegment = iconUrl.split('/').pop();
  if (!lastSegment) {
    return '';
  }

  const [codePart] = lastSegment.split('?');
  const [iconCode] = codePart.split(',');

  return normalize(iconCode);
};

const matchesAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

export const getWeatherEmoji = (iconUrl?: string | null, shortForecast?: string | null) => {
  const iconCode = extractIconCode(iconUrl);
  const forecast = normalize(shortForecast);

  const candidates = [iconCode, forecast].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (matchesAny(candidate, ['tornado', 'hurricane', 'tropical'])) {
      return '🌪️';
    }
    if (matchesAny(candidate, ['tsra', 'tstorm', 'thunder', 'storm'])) {
      return '⛈️';
    }
    if (matchesAny(candidate, ['snow', 'ice', 'sleet', 'blizzard', 'flurr'])) {
      return '❄️';
    }
    if (matchesAny(candidate, ['rain', 'shower', 'drizzle', 'ra', 'sprinkle'])) {
      return '🌧️';
    }
    if (matchesAny(candidate, ['fog', 'haze', 'smoke', 'mist'])) {
      return '🌫️';
    }
    if (matchesAny(candidate, ['wind', 'breezy', 'gust'])) {
      return '💨';
    }
    if (matchesAny(candidate, ['cloud', 'ovc', 'bkn', 'sct', 'mcloud', 'mostly cloudy'])) {
      return '☁️';
    }
    if (matchesAny(candidate, ['sun', 'clear', 'few', 'skc', 'hot'])) {
      return '☀️';
    }
  }

  return '🌡️';
};

export default getWeatherEmoji;
