export interface PersonName {
  firstName: string;
  lastName: string;
}

export function getFullName({ firstName, lastName }: PersonName): string {
  return `${firstName} ${lastName}`;
}
