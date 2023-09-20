import {
  CreateArmorerRepository,
  CreateArmorerUseCase,
  Encryptor,
} from './ad-create-armorer-protocols'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(
    private readonly encryptor: Encryptor,
    private readonly createArmorerRepository: CreateArmorerRepository
  ) {}

  async create(
    data: CreateArmorerUseCase.Input
  ): Promise<CreateArmorerUseCase.Output> {
    const { password } = data
    const hashedPassword = await this.encryptor.encrypt(password)
    return this.createArmorerRepository.create({
      ...data,
      password: hashedPassword,
    })
  }
}
