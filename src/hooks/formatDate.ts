export function formatDate(date: string) {
  const [day, month, year] = date.split("/");
  const isoLikeString = `${year}-${month}-${day}`;
  return isoLikeString;
}
