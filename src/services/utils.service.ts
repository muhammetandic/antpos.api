export function createSixCharCode() {
  return Math.random().toString().slice(2, 8);
}

export function createRandomControlCode() {
  return crypto.randomUUID();
}
