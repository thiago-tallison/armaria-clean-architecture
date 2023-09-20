import { Encryptor } from '@/data/protocols/encryptor'
import { describe, expect, it, vi } from 'vitest'
import { DBCreteArmorerUseCase } from './db-create-armorer-usecase'

describe('DBCreteArmorer UseCase', () => {
  it('should call Encryptor with correct password', () => {
    const armorerData = {
      registration: 'any_registration',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      phone: 'any_phone_number',
    }

    class EncryptorStub implements Encryptor {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve(`${value}_encrypted`))
      }
    }

    const encryptorStub = new EncryptorStub()
    const encryptorSpy = vi.spyOn(encryptorStub, 'encrypt')

    const sut = new DBCreteArmorerUseCase(encryptorStub)
    sut.create(armorerData)
    expect(encryptorSpy).toHaveBeenCalledWith(armorerData.password)
  })
})
