export function parseJson(str: string): object | null {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (e) {
    return null;
  }
}
