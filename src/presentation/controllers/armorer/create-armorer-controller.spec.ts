import { describe, it, expect, vi } from 'vitest'
import { CreateArmorerController } from './create-armorer-controller'
import {
  HttpRequest,
  EmailValidator,
  CreateArmorerUseCase,
} from './create-armorer-protocols'
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors'

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

const makeCreateArmorerUseCase = (): CreateArmorerUseCase => {
  class CreateArmorerUseCaseStub implements CreateArmorerUseCase {
    async execute(
      data: CreateArmorerUseCase.Input
    ): Promise<CreateArmorerUseCase.Output> {
      return new Promise((resolve) => resolve(data))
    }
  }
  return new CreateArmorerUseCaseStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      console.log(email)
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: CreateArmorerController;
  emailValidatorStub: EmailValidator;
  createArmorerUseCaseStub: CreateArmorerUseCase;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const createArmorerUseCaseStub = makeCreateArmorerUseCase()
  return {
    sut: new CreateArmorerController(
      emailValidatorStub,
      createArmorerUseCaseStub
    ),
    emailValidatorStub: emailValidatorStub,
    createArmorerUseCaseStub,
  }
}

describe('CreateArmorerController', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.name
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  it('should return 400 if no registration is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    delete httpRequest.body.registration
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('registration'))
  })

  it('should return 400 if passwords does not match', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = 'invalid-password'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })

  it('should return 400 if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'invalid-email'
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValid = vi.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledOnce()
    expect(isValid).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 201 if all data is valid', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(typeof httpResponse.body).toBe('object')
  })

  it('should call CreateArmorerUseCase with correct values', async () => {
    const { sut, createArmorerUseCaseStub } = makeSut()
    const execute = vi.spyOn(createArmorerUseCaseStub, 'execute')
    const httpRequest = makeHttpRequest()
    sut.handle(httpRequest)
    const { name, email, password, registration, phone } = httpRequest.body
    expect(execute).toHaveBeenCalledOnce()
    expect(execute).toHaveBeenCalledWith({
      name,
      email,
      password,
      registration,
      phone,
    })
  })

  it('should throw if CreateArmorerUseCase throws', async () => {
    const { sut, createArmorerUseCaseStub } = makeSut()
    vi.spyOn(createArmorerUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const httpResponse =  await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
