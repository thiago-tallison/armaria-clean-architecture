import { describe, it, expect, vi } from 'vitest'
import { CreateArmorerController } from './create-armorer-controller'
import { HttpRequest, EmailValidator } from '../protocols'
import { MissingParamError } from '../errors'
import { InvalidParamError } from '../errors/invalid-params-error'
import { ServerError } from '../errors/server-error'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    registration: 'any-registration',
    name: 'any-name',
    email: 'any-email@mail.com',
    password: 'any-password',
    passwordConfirmation: 'any-password',
    phone: 'any-phone',
  },
})

type SutTypes = {
  sut: CreateArmorerController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  return {
    sut: new CreateArmorerController(emailValidatorStub),
    emailValidatorStub: emailValidatorStub,
  }
}

describe('CreateArmorerController', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.name
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.password
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  it('should return 400 if no registration is provided', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.registration
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('registration'))
  })

  it('should return 400 if passwords does not match', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = 'invalid-password'
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new Error('Password and password confirmation must be equal')
    )
  })

  it('should return 400 if email is not valid', () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'invalid-email'
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  
  it('should call EmailValidator with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValid = vi.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledOnce()
    expect(isValid).toHaveBeenCalledWith(httpRequest.body.email)
  })
  
  it('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 if all data is valid', () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})
