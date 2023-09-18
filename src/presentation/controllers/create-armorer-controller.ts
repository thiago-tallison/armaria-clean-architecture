import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class CreateArmorerController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if(!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if(!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }

    if(!httpRequest.body.registration) {
      return badRequest(new MissingParamError('registration'))
    }
    
    return {
      statusCode: 400,
      body: new Error('Missing param: email')
    }
  }
}