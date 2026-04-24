export function normalizeTechs(techName: string): string {
  const arrOfWords = techName.trim().toLocaleLowerCase().split("");
  const hasEnter = arrOfWords.findIndex((val) => val === "\n");

  if (hasEnter > 0) {
    arrOfWords.splice(hasEnter, 1);
  }

  arrOfWords[0] = arrOfWords[0].toLocaleUpperCase();
  return arrOfWords.join("");
}
