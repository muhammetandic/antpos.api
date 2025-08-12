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
import { UserToken } from "./schemes/user-token.js";
import { TokenKind } from "./constants/token-kind.js";
import { TenMinutesInMilliseconds } from "./constants/timeout.js";
import { ConfirmOtpRequest } from "./models/confirm-otp.request.js";
import { ConfirmResponse } from "./models/confirm.response.js";
import { ResetPasswordRequest } from "./models/reset-password.request.js";

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

export async function registerAsync(request: RegisterRequest): Promise<Result<ControlCodeResponse>> {
  const { email, password, name, phone } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (user) {
    return new Result<ControlCodeResponse>()
      .setStatus(HttpStatus.BadRequest)
      .setErrors({ email: ["email already exist"] });
  }

  const hashedPassword = await hashPasswordAsync(password);
  const newUser = new User({ email, password: hashedPassword, name, phone });
  await newUser.save();

  const otp = createSixCharCode();
  const controlCode = createRandomControlCode();
  const paramaters = { mail: email, name: name, otp: otp, controlCode: controlCode };
  await addToMailQueue(newUser._id.toString(), MailKind.WELCOME, paramaters);

  const newUserToken = new UserToken({
    userId: newUser._id,
    kind: TokenKind.EMAIL_CONFIRMATION,
    controlCode,
    otp,
    expiresAt: new Date(Date.now() + TenMinutesInMilliseconds),
  });
  await newUserToken.save();

  return new Result<ControlCodeResponse>().setStatus(HttpStatus.Ok).setData({ controlCode });
}

export async function forgetPasswordAsync(request: ForgetPasswordRequest): Promise<Result<ControlCodeResponse>> {
  const { email } = request;
  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<ControlCodeResponse>().setStatus(HttpStatus.NotFound).setErrors({ email: ["user not found"] });
  }

  const otp = createSixCharCode();
  const controlCode = createRandomControlCode();
  const parameters = { mail: email, name: user.name, otp: otp, controlCode: controlCode };
  await addToMailQueue(user._id.toString(), MailKind.CONFIRM_PASSWORD_OTP, parameters);

  const newUserToken = new UserToken({
    userId: user._id,
    kind: TokenKind.PASSWORD_RESET,
    controlCode,
    otp,
    expiresAt: new Date(Date.now() + TenMinutesInMilliseconds),
  });
  await newUserToken.save();

  return new Result<ControlCodeResponse>().setStatus(HttpStatus.Ok).setData({ controlCode });
}

export async function confirmMailAsync(request: ConfirmOtpRequest): Promise<Result<ConfirmResponse>> {
  const { email, controlCode, otp } = request;

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.NotFound).setErrors({ email: ["user not found"] });
  }

  const token = await UserToken.findOne({ userId: user._id, kind: TokenKind.EMAIL_CONFIRMATION, controlCode });
  if (!token) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.BadRequest).setErrors({ token: ["token not found"] });
  }

  if (token?.otp !== otp) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.BadRequest).setErrors({ otp: ["invalid otp"] });
  }

  user.emailVerified = true;
  await user.save();

  await UserToken.findOneAndDelete({ userId: user._id, kind: TokenKind.EMAIL_CONFIRMATION, controlCode });

  return new Result<ConfirmResponse>().setStatus(HttpStatus.Ok).setData({ email: user.email });
}

export async function confirmResetPasswordAsync(request: ConfirmOtpRequest): Promise<Result<ConfirmResponse>> {
  const { email, controlCode, otp } = request;

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.NotFound).setErrors({ email: ["user not found"] });
  }

  const token = await UserToken.findOne({ userId: user._id, kind: TokenKind.EMAIL_CONFIRMATION, controlCode });
  if (!token) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.BadRequest).setErrors({ token: ["token not found"] });
  }

  if (token?.otp !== otp) {
    return new Result<ConfirmResponse>().setStatus(HttpStatus.BadRequest).setErrors({ otp: ["invalid otp"] });
  }

  const newControlCode = createRandomControlCode();
  await UserToken.findOneAndUpdate({
    userId: user._id,
    kind: TokenKind.EMAIL_CONFIRMATION,
    controlCode: newControlCode,
  });

  return new Result<ConfirmResponse>()
    .setStatus(HttpStatus.Ok)
    .setData({ email: user.email, controlCode: newControlCode });
}

export async function resetPasswordAsync(request: ResetPasswordRequest): Promise<Result<void>> {
  const { email, controlCode, password } = request;

  const user = await User.findOne({ email: email, isDeleted: false });
  if (!user) {
    return new Result<void>().setStatus(HttpStatus.NotFound).setErrors({ email: ["user not found"] });
  }

  const token = await UserToken.findOne({ userId: user._id, kind: TokenKind.EMAIL_CONFIRMATION, controlCode });
  if (!token) {
    return new Result<void>().setStatus(HttpStatus.BadRequest).setErrors({ token: ["token not found"] });
  }

  user.password = await hashPasswordAsync(password);
  await user.save();

  await UserToken.findOneAndDelete({ userId: user._id, kind: TokenKind.EMAIL_CONFIRMATION, controlCode });

  return new Result<void>().setStatus(HttpStatus.Ok).setData();
}
