import { MunicipalGuard } from '@/domain/models/municipal-guard'

export interface CreateMunicipalGuardUseCase {
  create(
    data: CreateMunicipalGuardUseCase.Input
  ): Promise<CreateMunicipalGuardUseCase.Output>
}

export namespace CreateMunicipalGuardUseCase {
  export type Input = MunicipalGuard
  export type Output = MunicipalGuard
}
