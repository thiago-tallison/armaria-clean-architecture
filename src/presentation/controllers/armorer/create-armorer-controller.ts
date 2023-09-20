import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import {
  Controller,
  CreateArmorerUseCase,
  EmailValidator,
  HttpRequest
} from './create-armorer-protocols'

export class CreateArmorerController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createArmorerUseCase: CreateArmorerUseCase
  ) {}

  async handle(httpRequest: HttpRequest) {
    const requiredFields = [
      'name',
      'email',
      'password',
      'registration',
      'passwordConfirmation'
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
      const armorer = await this.createArmorerUseCase.create({
        name,
        email,
        password,
        registration,
        phone
      })
      return created(armorer)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
