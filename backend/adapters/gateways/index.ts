import { SignInRepository } from './repositories/SignInRepository';
import { SignUpRepository } from './repositories/SignUpRepository';

export * from './Mappers';
export const SignUpGateway = SignUpRepository;
export const SignInGateway = SignInRepository;
