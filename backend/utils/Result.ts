export interface IError {
  resource: string;
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

export class Result<T> {
  public succeeded: boolean;
  private readonly _statusCode: number;
  private readonly _errors: IError;
  private readonly _value?: T;

  private constructor(statusCode: number, value?: T, errors?: IError) {
    this._statusCode = statusCode;
    this.succeeded = true;
    this._errors = {
      resource: '',
      code: '',
      message: '',
      errors: [],
    };
    this._value = value;

    if (errors?.resource) {
      this.succeeded = false;
      this._errors = errors;
      this._value = undefined;
    }

    Object.freeze(this);
  }

  public get value(): T {
    if (!this.succeeded) {
      throw new Error(
        "Can't get the value of an error result. Use 'errors' instead."
      );
    }

    return this._value as T;
  }

  public get errors(): IError {
    return this._errors;
  }

  public get statusCode(): number {
    return this._statusCode;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(200, value);
  }

  public static fail<U>(statusCode: number, errors: IError): Result<U> {
    return new Result<U>(statusCode, undefined, errors);
  }
}
