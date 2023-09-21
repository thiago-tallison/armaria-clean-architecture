import {
  CheckMunicipalGuardByEmailRepository,
  CheckMunicipalGuardRepository,
  CreateMunicipalGuardRepository,
  CreateMunicipalGuardUseCase
} from './create-municipal-guard-protocols'

export class DBCreteMunicipalGuardUseCase
  implements CreateMunicipalGuardUseCase
{
  constructor(
    private readonly createMunicipalGuardRepository: CreateMunicipalGuardRepository,
    private readonly checkMunicipalGuardRepository: CheckMunicipalGuardRepository,
    private readonly checkMunicipalGuardByEmailRepository: CheckMunicipalGuardByEmailRepository
  ) {}

  async create(
    data: CreateMunicipalGuardUseCase.Input
  ): Promise<CreateMunicipalGuardUseCase.Output> {
    const guardAlreadyExists = await this.checkMunicipalGuardRepository.check(
      data.registration
    )
    if (guardAlreadyExists) {
      throw new Error('Guard municipal já cadastrado')
    }
    const guardByEmailAlreadyExists =
      await this.checkMunicipalGuardByEmailRepository.check(data.email)
    if (guardByEmailAlreadyExists) {
      throw new Error('Guard municipal já cadastrado')
    }
    const guard = this.createMunicipalGuardRepository.create(data)
    return guard
  }
}
