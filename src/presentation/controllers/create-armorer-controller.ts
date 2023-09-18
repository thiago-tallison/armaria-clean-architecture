import { InvalidParamError, ServerError, MissingParamError } from '../errors'
import { badRequest, serverError, ok } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'

export class CreateArmorerController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const { password, passwordConfirmation, email } = httpRequest.body
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
    if (password !== passwordConfirmation) {
      return badRequest(
        new Error('Password and password confirmation must be equal')
      )
    }
    try {
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(new ServerError())
    }
    return ok()
  }
}
