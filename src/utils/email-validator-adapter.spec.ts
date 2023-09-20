import { describe, expect, it, vi } from 'vitest'
import { emailSchema } from './email-schema'
import { EmailValidatorAdapter } from './email-validator-adapter'

vi.mock('./email-schema')

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    vi.spyOn(emailSchema, 'parse').mockImplementationOnce(() => {
      throw new Error()
    })

    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  it('ensure EmailValidatorAdapter.isValid is called with correct email', () => {
    const parseSpy = vi.spyOn(emailSchema, 'parse')
    const sut = new EmailValidatorAdapter()
    const email = 'any_email@mail.com'
    sut.isValid(email)
    expect(parseSpy).toHaveBeenCalledWith(email)
    expect(parseSpy).toHaveBeenCalledTimes(1)
  })
})
