export interface VerifyRefreshTokensService {
  execute(refreshToken: string): Promise<string>;
}
