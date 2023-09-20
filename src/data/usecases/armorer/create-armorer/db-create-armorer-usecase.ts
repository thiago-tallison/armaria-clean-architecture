import {
  CheckArmorerRepository,
  CreateArmorerRepository,
  CreateArmorerUseCase,
  Encryptor,
} from './ad-create-armorer-protocols'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(
    private readonly encryptor: Encryptor,
    private readonly createArmorerRepository: CreateArmorerRepository,
    private readonly checkArmorerRepository: CheckArmorerRepository
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

    const { password } = data
    const hashedPassword = await this.encryptor.encrypt(password)
    return this.createArmorerRepository.create({
      ...data,
      password: hashedPassword,
    })
  }
}
