import { Encryptor } from '@/data/protocols/encryptor'
import { describe, expect, it, vi } from 'vitest'
import { DBCreteArmorerUseCase } from './db-create-armorer-usecase'

type SutType = {
  sut: DBCreteArmorerUseCase
  encryptorStub: Encryptor
}

const makeArmorerData = () => ({
  registration: 'any_registration',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  phone: 'any_phone_number',
})

const makeSut = (): SutType => {
  class EncryptorStub implements Encryptor {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve(`${value}_encrypted`))
    }
  }

  const encryptorStub = new EncryptorStub()

  const sut = new DBCreteArmorerUseCase(encryptorStub)

  return { sut, encryptorStub }
}

describe('DBCreteArmorer UseCase', () => {
  it('should call Encryptor with correct password', async () => {
    const armorerData = makeArmorerData()
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = vi.spyOn(encryptorStub, 'encrypt')
    await sut.create(armorerData)
    expect(encryptorSpy).toHaveBeenCalledWith(armorerData.password)
  })

  it('should throw if Encryptor throws', async () => {
    const armorerData = makeArmorerData()
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = vi.spyOn(encryptorStub, 'encrypt')
    encryptorSpy.mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )
    await expect(sut.create(armorerData)).rejects.toThrow()
  })
})
