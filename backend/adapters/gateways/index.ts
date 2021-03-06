import { SignInRepository } from './repositories/SignInRepository';
import { SignUpRepository } from './repositories/SignUpRepository';
import { GetMfaSettingCodeRepository } from './repositories/GetSettingCodeRepository';
import { VerifyMfaRepository } from './repositories/VerifyMfaRepository';
import { EnableMfaRepository } from './repositories/EnableMfaRepository';
import { GetMfaQrCodeRepository } from './repositories/GetQrCodeRepository';

export * from './Mappers';
export const SignUpGateway = SignUpRepository;
export const SignInGateway = SignInRepository;
export const GetMfaSettingCodeGateway = GetMfaSettingCodeRepository;
export const VerifyMfaGateway = VerifyMfaRepository;
export const EnableMfaGateway = EnableMfaRepository;
export const GetMfaQrCodeGateway = GetMfaQrCodeRepository;
