import {
  CheckArmorerByEmailRepository,
  CheckArmorerRepository,
  CreateArmorerRepository,
  CreateArmorerUseCase,
  Encryptor
} from './ad-create-armorer-protocols'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(
    private readonly encryptor: Encryptor,
    private readonly createArmorerRepository: CreateArmorerRepository,
    private readonly checkArmorerRepository: CheckArmorerRepository,
    private readonly checkArmorerByEmailRepository: CheckArmorerByEmailRepository
  ) {}

  async create(
    data: CreateArmorerUseCase.Input
  ): Promise<CreateArmorerUseCase.Output> {
    const armorerAlreadyExists = await this.checkArmorerRepository.check(
      data.registration
    )
    if (armorerAlreadyExists) {
      throw new Error('Armorer already exists')
    }
    const armorerByEmailAlreadyExists =
      await this.checkArmorerByEmailRepository.check(data.email)
    if (armorerByEmailAlreadyExists) {
      throw new Error('Armorer already exists')
    }
    const { password } = data
    const hashedPassword = await this.encryptor.encrypt(password)
    const armorer = this.createArmorerRepository.create({
      ...data,
      password: hashedPassword
    })
    return armorer
  }
}
