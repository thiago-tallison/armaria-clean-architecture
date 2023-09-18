import { MissingParamError } from '../errors/missing-params-error'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class CreateArmorerController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if(!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if(!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new MissingParamError('password')
      }
    }

    if(!httpRequest.body.registration) {
      return {
        statusCode: 400,
        body: new MissingParamError('registration')
      }
    }
    
    return {
      statusCode: 400,
      body: new Error('Missing param: email')
    }
  }
}