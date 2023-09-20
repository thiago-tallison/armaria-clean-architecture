import { Encryptor } from '@/data/protocols/encryptor'

export class DBCreteArmorerUseCase {
  constructor(private readonly encryptor: Encryptor) {}

  async create(data: any): Promise<any> {
    await this.encryptor.encrypt(data.password)
  }
}
