export function parseCartStorage(): Array<string> {
  const localStorageCart: string | null = localStorage.getItem("cart");

  if (localStorageCart === null) {
    localStorage.setItem("cart", "[]");
    return [];
  }

  try { return JSON.parse(localStorageCart); }
  catch(err) { localStorage.setItem("cart", "[]"); return []; }
}