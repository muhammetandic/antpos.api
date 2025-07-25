export type LoginRequest = {
  email: string;
  password: string;
  authType: "cookie" | "token";
};
