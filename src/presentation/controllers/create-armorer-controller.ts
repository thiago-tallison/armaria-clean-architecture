import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class CreateArmorerController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'registration', 'passwordConfirmation']
    for(const field of requiredFields) {
      if(!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    if(httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(new Error('Password and password confirmation must be equal'))
    }
  }
}