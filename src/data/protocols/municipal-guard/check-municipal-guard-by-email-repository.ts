export interface CheckMunicipalGuardByEmailRepository {
  check(email: string): Promise<boolean>
}
