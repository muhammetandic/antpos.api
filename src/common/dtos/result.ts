import { HttpStatus } from "../constants/http-status.js";

export class Result<T> {
  public data?: T;
  public errors?: Record<string, string[]>;
  public status: HttpStatus;

  constructor() {
    this.status = HttpStatus.Ok;
    return this;
  }

  setStatus(status: HttpStatus) {
    this.status = status;
    return this;
  }

  setData(data: T) {
    this.data = data;
    return this;
  }

  setErrors(errors: Record<string, string[]>) {
    this.errors = errors;
    return this;
  }
}
