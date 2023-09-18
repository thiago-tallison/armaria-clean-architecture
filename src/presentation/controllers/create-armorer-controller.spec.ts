import { describe, it, expect, vi } from 'vitest'
import { CreateArmorerController } from './create-armorer-controller'
import { MissingParamError } from '../errors/missing-params-error'
import { HttpRequest } from '../protocols/http'
import { InvalidParamError } from '../errors/invalid-params-error'
import { EmailValidator } from '../protocols/email-validator'


const makeHttpRequest = (): HttpRequest => ({
  body: {
    registration: 'any-registration',
    name: 'any-name',
    email: 'any-email@mail.com',
    password: 'any-password',
    passwordConfirmation: 'any-password',
    phone: 'any-phone',
  }
})

type SutTypes = {
  sut: CreateArmorerController
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator{
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  return {
    sut: new CreateArmorerController(emailValidatorStub),
    emailValidator: emailValidatorStub
  }
}

describe('CreateArmorerController', () => {
  it('should return 400 if no name is provided', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.name
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))

  })

  it('should return 400 if no email is provided', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))

  })

  it('should return 400 if no password is provided', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.password
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))

  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))

  })
  
  it('should return 400 if no registration is provided', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.registration
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('registration'))

  })

  it('should return 400 if passwords does not match', () => {
    const {sut} = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = 'invalid-password'
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Password and password confirmation must be equal'))
  })

  it('should return 400 if email is not valid', () => {
    const {sut, emailValidator} = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'invalid-email'
    vi.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})