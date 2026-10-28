export interface PersonName {
  firstName: string;
  lastName: string;
}

export function getFullName({ firstName, lastName }: PersonName): string {
  return `${firstName} ${lastName}`;
}

/** First name and last initial ("Mia C."), for places classmates can see. */
export function getShortName({ firstName, lastName }: PersonName): string {
  const initial = lastName.trim().charAt(0);
  return initial ? `${firstName} ${initial.toUpperCase()}.` : firstName;
}
