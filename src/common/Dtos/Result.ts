export class Result<T> {
  public data?: T;
  public errors?: Record<string, string[]>;

  constructor() {
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
