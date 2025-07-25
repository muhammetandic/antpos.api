import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPasswordAsync(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function verifyPasswordAsync(password: string, hashedPassword: string): Promise<boolean> {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}
