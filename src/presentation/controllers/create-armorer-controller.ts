import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class CreateArmorerController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'registration']
    for(const field of requiredFields) {
      if(!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}