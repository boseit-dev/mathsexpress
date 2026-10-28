import { formatYearLevel, YEAR_LEVELS, yearLevelToNumber } from '@/domain/student';

/** Year levels for a select field. Values are numbers ("0" is Kindergarten); see parseYearLevel. */
export const yearLevelOptions = YEAR_LEVELS.map((yearLevel) => ({
  value: String(yearLevelToNumber(yearLevel)),
  label: formatYearLevel(yearLevel),
}));
