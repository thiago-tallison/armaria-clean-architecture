import bcrypt from 'bcrypt'

import { BcrypterAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => {
    return new Promise(resolve => resolve('hash'))
  }
}))

describe('BcrypterAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashValue = await sut.encrypt('any_value')
    expect(hashValue).toEqual('hash')
  })
})
