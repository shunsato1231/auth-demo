import { SignUp } from '@useCases';

type APISiginUpInput = {
  params: unknown;
  headers?: unknown;
  body: SignUp.SignUpRequestDTO;
};

export class SignUpController {
  private _input: APISiginUpInput;
  private _signUpInteractor: SignUp.SignUpInteractor;

  constructor(input: APISiginUpInput, interactor: SignUp.SignUpInteractor) {
    this._input = input;
    this._signUpInteractor = interactor;
  }

  async run(): Promise<void> {
    const request: SignUp.SignUpRequestDTO = {
      email: this._input.body.email,
      password: this._input.body.password,
    };
    await this._signUpInteractor.execute(request);
  }
}
