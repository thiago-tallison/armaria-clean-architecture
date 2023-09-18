import { HttpRequest, HttpResponse } from '../protocols/http'

export class CreateArmorerController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if(!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if(!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new Error('Missing param: password')
      }
    }

    if(!httpRequest.body.registration) {
      return {
        statusCode: 400,
        body: new Error('Missing param: registration')
      }
    }
    
    return {
      statusCode: 400,
      body: new Error('Missing param: email')
    }
  }
}