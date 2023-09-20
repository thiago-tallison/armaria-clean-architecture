import { CreateArmorerUseCase, Encryptor } from './ad-create-armorer-protocols'

export class DBCreteArmorerUseCase implements CreateArmorerUseCase {
  constructor(private readonly encryptor: Encryptor) {}

  async create(data: any): Promise<any> {
    const { password } = data
    await this.encryptor.encrypt(password)
    await new Promise(resolve => resolve(null))
  }
}
