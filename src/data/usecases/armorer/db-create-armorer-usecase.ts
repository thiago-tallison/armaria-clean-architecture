import { Encryptor } from '@/data/protocols/encryptor'
import { CreateArmorerUseCase } from '@/domain/usecases/armorer/create-armorer-usecase'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(private readonly encryptor: Encryptor) {}

  async create(data: any): Promise<any> {
    const { password } = data
    await this.encryptor.encrypt(password)
    await new Promise(resolve => resolve(null))
  }
}
