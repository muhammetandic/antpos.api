import { LoginRequest } from "./models/login.request.js";
import { TokenResponse } from "./models/token.response.js";
import { User } from "./schemes/user.js";
import { RegisterRequest } from "./models/register.request.js";
import { hashPasswordAsync, verifyPasswordAsync } from "../../services/crypt.service.js";
import { createAccessToken, createRefreshToken } from "../../services/jwt.service.js";
import { Result } from "../../common/dtos/result.js";
import { HttpStatus } from "../../common/constants/http-status.js";
import { ForgetPasswordRequest } from "./models/forget-password.request.js";
import { addToMailQueue } from "../../services/queue.service.js";
import { createRandomControlCode, createSixCharCode } from "../../services/utils.service.js";
import { ControlCodeResponse } from "./models/control-code.response.js";
import { MailKind } from "../../common/enums/mail-kind.js";

export async function loginAsync(request: LoginRequest): Promise<Result<TokenResponse>> {
  const { email, password } = request;

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<TokenResponse>().setStatus(HttpStatus.NotFound).setErrors({ user: ["user not found"] });
  }

  if (!(await verifyPasswordAsync(password, user.password))) {
    return new Result<TokenResponse>().setStatus(HttpStatus.BadRequest).setErrors({ password: ["invalid password"] });
  }

  const jwtPayload = { sub: user._id.toString(), email: email };
  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);

  return new Result<TokenResponse>().setStatus(HttpStatus.Ok).setData(new TokenResponse(accessToken, refreshToken));
}

export async function registerAsync(request: RegisterRequest): Promise<Result<null>> {
  const { email, password, name, phone } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (user) {
    return new Result<null>().setStatus(HttpStatus.BadRequest).setErrors({ email: ["email already exist"] });
  }

  const hashedPassword = await hashPasswordAsync(password);
  const newUser = new User({ email, password: hashedPassword, name, phone });
  await newUser.save();

  return new Result<null>().setStatus(HttpStatus.Ok).setData(null);
}

export async function forgetPasswordAsync(request: ForgetPasswordRequest): Promise<Result<ControlCodeResponse>> {
  const { email } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<ControlCodeResponse>().setStatus(HttpStatus.NotFound).setErrors({ email: ["user not found"] });
  }

  const otp = createSixCharCode();
  const controlCode = createRandomControlCode();
  const parameters = { mail: email, name: user.name, otp: otp };
  await addToMailQueue(user._id.toString(), MailKind.CONFIRM_PASSWORD_OTP, parameters);

  return new Result<ControlCodeResponse>().setStatus(HttpStatus.Ok).setData({ controlCode });
}

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
