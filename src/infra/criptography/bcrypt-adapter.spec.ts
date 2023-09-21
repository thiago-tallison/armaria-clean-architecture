import bcrypt from 'bcrypt'

import { BcrypterAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => {
    return new Promise(resolve => resolve('hash'))
  }
}))

type SutTypes = {
  salt: number
  sut: BcrypterAdapter
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcrypterAdapter(salt)

  return {
    salt,
    sut
  }
}

describe('BcrypterAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hashValue = await sut.encrypt('any_value')
    expect(hashValue).toEqual('hash')
  })

  it('should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    await expect(sut.encrypt('any_value')).rejects.toThrow()
  })
})
