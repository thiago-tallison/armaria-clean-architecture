export interface CheckArmorerRepository {
  check(registration: string): Promise<boolean>
}
