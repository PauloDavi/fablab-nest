export interface DeleteTokensService {
  execute(uniqueIdentifierOrToken: string): Promise<void>;
}
