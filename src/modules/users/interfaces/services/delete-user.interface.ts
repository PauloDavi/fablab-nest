export interface DeleteUserService {
  execute(id: string): Promise<void>;
}
