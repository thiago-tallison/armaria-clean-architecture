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
    await this.encryptor.encrypt(password)
    await this.createArmorerRepository.create(data)
    await new Promise(resolve => resolve(null))
  }
}
