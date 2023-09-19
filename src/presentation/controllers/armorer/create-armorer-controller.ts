import {
  InvalidParamError,
  ServerError,
  MissingParamError,
} from '../../errors'
import { badRequest, serverError, created } from '../../helpers/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  CreateArmorerUseCase,
} from './create-armorer-protocols'

export class CreateArmorerController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createArmorerUseCase: CreateArmorerUseCase
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'registration',
      'passwordConfirmation',
    ]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { name, password, passwordConfirmation, email, registration, phone } =
      httpRequest.body
    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }
    try {
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(new ServerError())
    }
    this.createArmorerUseCase.execute({
      name,
      email,
      password,
      registration,
      phone,
    })
    return created()
  }
}
