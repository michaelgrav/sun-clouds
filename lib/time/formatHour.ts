export const formatHour = (iso?: string): string => {
  if (!iso) {
    return '';
  }
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch (error) {
    return iso;
  }
};
