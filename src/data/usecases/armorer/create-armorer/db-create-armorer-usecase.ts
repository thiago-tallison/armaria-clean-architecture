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

  async create(data: any): Promise<any> {
    const { password } = data
    const hashedPassword = await this.encryptor.encrypt(password)
    await this.createArmorerRepository.create({
      ...data,
      password: hashedPassword,
    })
    await new Promise(resolve => resolve(null))
  }
}
