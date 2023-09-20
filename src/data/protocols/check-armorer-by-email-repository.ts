export interface CheckArmorerByEmailRepository {
  check(email: string): Promise<boolean>
}
