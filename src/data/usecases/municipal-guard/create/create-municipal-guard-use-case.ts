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

  async create({
    email,
    name,
    registration,
    phone
  }: CreateMunicipalGuardUseCase.Input) {
    const guardAlreadyExists =
      await this.checkMunicipalGuardRepository.check(registration)
    if (guardAlreadyExists) {
      throw new Error('Guard municipal já cadastrado')
    }
    const guardByEmailAlreadyExists =
      await this.checkMunicipalGuardByEmailRepository.check(email)
    if (guardByEmailAlreadyExists) {
      throw new Error('Guard municipal já cadastrado')
    }
    const guard = await this.createMunicipalGuardRepository.create({
      email,
      name,
      registration,
      phone
    })
    return guard
  }
}
