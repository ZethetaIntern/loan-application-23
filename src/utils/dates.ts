export function ageOn(dateOfBirthIso: string, today: Date = new Date()): number {
  const birth = new Date(dateOfBirthIso);
  if (Number.isNaN(birth.getTime())) return Number.NaN;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}
