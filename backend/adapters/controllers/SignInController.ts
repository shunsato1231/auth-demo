import { SignIn } from '@useCases';

type APISiginInInput = {
  params: unknown;
  headers?: unknown;
  body: SignIn.SignInRequestDTO;
};

export class SignInController {
  private _input: APISiginInInput;
  private _signInInteractor: SignIn.SignInInteractor;

  constructor(input: APISiginInInput, interactor: SignIn.SignInInteractor) {
    this._input = input;
    this._signInInteractor = interactor;
  }

  async run(): Promise<void> {
    const request: SignIn.SignInRequestDTO = {
      email: this._input.body.email,
      password: this._input.body.password,
    };
    await this._signInInteractor.execute(request);
  }
}
