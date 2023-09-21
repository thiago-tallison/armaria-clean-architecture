export interface CheckMunicipalGuardRepository {
  check(registration: string): Promise<boolean>
}
