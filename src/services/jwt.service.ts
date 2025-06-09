import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";
const ACCESS_TOKEN_EXPIRATION: string = process.env.ACCESS_TOKEN_EXPIRATION ?? "30m";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION ?? "30d";

export function createAccessToken(payload: JwtPayload): string {
  const options = { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions;
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
}

export function createRefreshToken(payload: JwtPayload): string {
  const options = { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions;
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload | string {
  const result = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return result;
}

export function verifyRefreshToken(token: string): JwtPayload | string {
  const result = jwt.verify(token, REFRESH_TOKEN_SECRET);
  return result;
}
