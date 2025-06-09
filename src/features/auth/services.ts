import { status } from "../../helpers/response.js";
import { LoginRequest } from "./models/login-request.js";
import { TokenResponse } from "./models/token-response.js";
import { User } from "./schemes/user.js";
import { RegisterRequest } from "./models/register-request.js";
import { hashPasswordAsync, verifyPasswordAsync } from "../../services/crypt.service.js";
import { createAccessToken, createRefreshToken } from "../../services/jwt.service.js";
import { Result } from "../../common/Dtos/Result.js";

export async function loginAsync(request: LoginRequest): Promise<Result<TokenResponse>> {
  const { email, password } = request;

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result(status.NotFound, "user not found");
  }

  if (!(await verifyPasswordAsync(password, user.password))) {
    return new Result(status.BadRequest, "incorrect password");
  }

  const jwtPayload = { sub: user._id.toString(), email: email };
  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);
  return new Result(status.Ok, new TokenResponse(accessToken, refreshToken));
}

export async function registerAsync(request: RegisterRequest): Promise<Result<null>> {
  const { email, password, name, phone } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (user) {
    return new Result(status.BadRequest, "email already exist");
  }

  const hashedPassword = await hashPasswordAsync(password);
  const newUser = new User({ email, password: hashedPassword, name, phone });
  await newUser.save();

  return new Result<TokenResponse>(status.Ok, null);
}

// export const signUpAsync = async (request: SignUpRequest): Promise<Result<SignUpResponse>> => {
//   const { email, name } = request;
//
//   const isExist = await User.findOne<IUser>({ email: email, isDeleted: false });
//   if (isExist) {
//     return new Result(status.BadRequest, "email already exist");
//   }
//
//   const token = createToken(email);
//   const tokenExpiresAt = new Date(Date.now() + tenMinutesInMilliseconds);
//   const code = createCode();
//
//   const user = new User<IUser>({
//     email,
//     name,
//     token,
//     tokenExpiresAt,
//     code,
//     isDeleted: false,
//     createdAt: new Date(Date.now()),
//   });
//
//   await user.save();
//
//   await sendEmail({
//     to: email,
//     subject: "yeni kayıt",
//     template: EMAIL_TEMPLATES.SIGNUP,
//     context: {
//       name: name,
//       email: email,
//       code: code,
//       token: token,
//     },
//   });
//
//   return new Result(status.Ok, { email, token });
// };
//
// export const setPasswordAsync = async (request: SetPasswordRequest): Promise<Result<SetPasswordResponse>> => {
//   const { email, token, code, password } = request;
//   const user = await User.findOne({ email: email, isDeleted: false });
//   if (!user) {
//     return new Result(status.NotFound, "user not found");
//   }
//
//   if (user?.token !== token) {
//     return new Result(status.BadRequest, "invalid token");
//   }
//
//   if (user?.tokenExpiresAt && user?.tokenExpiresAt.getTime() < Date.now()) {
//     return new Result(status.BadRequest, "token expired");
//   }
//
//   if (user?.code !== code) {
//     return new Result(status.BadRequest, "invalid code");
//   }
//
//   const encrypted = encrypt(password);
//
//   if (encrypted === null) {
//     return new Result(status.InternalServerError, "password encryption failed");
//   }
//
//   await user.updateOne({
//     password: encrypted?.encryptedText,
//     salt: encrypted?.salt,
//     token: null,
//     tokenExpiresAt: null,
//     code: null,
//     updatedAt: new Date(Date.now()),
//   });
//
//   return new Result(status.Ok, {});
// };
//
// export const forgotPasswordAsync = async (
//   request: ForgottenPasswordRequest,
// ): Promise<Result<ForgottenPasswordResponse>> => {
//   const { email } = request;
//   const user = await User.findOne({ email: email, isDeleted: false });
//
//   if (!user) {
//     return new Result(status.NotFound, "user not found");
//   }
//
//   const token = createToken(email);
//   const tokenExpiresAt = new Date(Date.now() + tenMinutesInMilliseconds);
//   const code = createCode();
//
//   await user.updateOne({ token, tokenExpiresAt, code, updatedAt: new Date(Date.now()) });
//
//   await sendEmail({
//     to: email,
//     subject: "sifre sıfırlama",
//     template: EMAIL_TEMPLATES.FORGOTTEN_PASSWORD,
//     context: {
//       name: user.name,
//       code: code,
//       email: user.email,
//       token: token,
//     },
//   });
//
//   const data = { email, token } as ForgottenPasswordResponse;
//   return new Result(status.Ok, data);
// };
