import bcrypt from 'bcrypt'
import { describe, expect, it, vi } from 'vitest'
import { BcrypterAdapter } from './bcrypt-adapter'

describe('BcrypterAdapter', () => {
  it('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
