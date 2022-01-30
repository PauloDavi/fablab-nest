export interface VerifyUserService {
  execute(token: string): Promise<void>;
}
