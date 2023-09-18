import { InvalidParamError } from '../errors/invalid-params-error'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest, ok } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

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
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return ok()
  }
}
