import { Encryptor } from '@/data/protocols/encryptor'
import { CreateArmorerUseCase } from '@/domain/usecases/armorer/create-armorer-usecase'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(private readonly encryptor: Encryptor) {}

  async execute(data: any): Promise<any> {
    await this.encryptor.encrypt(data.password)
  }
}
