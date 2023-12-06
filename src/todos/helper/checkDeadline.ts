export function checkDeadline(deadlineDate: string): boolean {
  const date = new Date(deadlineDate).getTime();
  const today = new Date().getTime();
  if (date > today) {
    return false;
  } else {
    return true;
  }
}
