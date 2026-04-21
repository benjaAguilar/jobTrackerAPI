export function normalizeTechs(techName: string): string {
  const arrOfWords = techName.trim().toLocaleLowerCase().split("");
  arrOfWords[0].toUpperCase();
  return arrOfWords.join("");
}
