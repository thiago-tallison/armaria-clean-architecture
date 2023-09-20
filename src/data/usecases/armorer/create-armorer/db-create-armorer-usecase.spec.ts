import { ArmorerModel } from '@/domain/models/armorer'
import { describe, expect, it, vi } from 'vitest'
import {
  CreateArmorerRepository,
  Encryptor,
} from './ad-create-armorer-protocols'
import { DBCreteArmorerUseCase } from './db-create-armorer-usecase'

type SutType = {
  sut: DBCreteArmorerUseCase
  encryptorStub: Encryptor
  createArmorerRepositoryStub: CreateArmorerRepository
}

const makeArmorerData = () => ({
  registration: 'any_registration',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  phone: 'any_phone_number',
})

const makeEncryptorStub = () => {
  class EncryptorStub implements Encryptor {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve(`${value}_encrypted`))
    }
  }
  return new EncryptorStub()
}

const makeCreateArmorerRepositoryStub = () => {
  class CreateArmorerRepositoryStub implements CreateArmorerRepository {
    create(data: ArmorerModel): Promise<ArmorerModel> {
      return new Promise(resolve => resolve(data))
    }
  }
  return new CreateArmorerRepositoryStub()
}

const makeSut = (): SutType => {
  const encryptorStub = makeEncryptorStub()
  const createArmorerRepositoryStub = makeCreateArmorerRepositoryStub()
  const sut = new DBCreteArmorerUseCase(
    encryptorStub,
    createArmorerRepositoryStub
  )
  return { sut, encryptorStub, createArmorerRepositoryStub }
}

describe('DBCreteArmorer UseCase', () => {
  it('should call Encryptor with correct password', async () => {
    const armorerData = makeArmorerData()
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = vi.spyOn(encryptorStub, 'encrypt')
    await sut.create(armorerData)
    expect(encryptorSpy).toHaveBeenCalledOnce()
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

  it('should call CreateArmorerRepository with correct values', async () => {
    const armorerData = makeArmorerData()
    const { sut, createArmorerRepositoryStub } = makeSut()
    const encryptorSpy = vi.spyOn(createArmorerRepositoryStub, 'create')
    await sut.create(armorerData)
    expect(encryptorSpy).toHaveBeenCalledOnce()
    expect(encryptorSpy).toHaveBeenCalledWith({
      ...armorerData,
      password: `${armorerData.password}_encrypted`,
    })
  })

  it('should throws if CreateArmorerRepository throws', async () => {
    const armorerData = makeArmorerData()
    const { sut, createArmorerRepositoryStub } = makeSut()
    vi.spyOn(createArmorerRepositoryStub, 'create').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )
    await expect(() => sut.create(armorerData)).rejects.toThrow(new Error())
  })
})
