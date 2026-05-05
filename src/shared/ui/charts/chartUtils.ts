import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateTick = (dateStr: string | number) => {
  try {
    const str = String(dateStr);
    const date = parseISO(str);
    return format(date, 'd MMM', { locale: es });
  } catch {
    return String(dateStr);
  }
};
