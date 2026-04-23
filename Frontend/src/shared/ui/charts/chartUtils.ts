import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateTick = (dateStr: string) => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'd MMM', { locale: es });
  } catch {
    return dateStr;
  }
};
