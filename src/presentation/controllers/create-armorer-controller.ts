export class CreateArmorerController {
  handle(httpRequest: any): any {
    console.log(httpRequest)
    
    return {
      statusCode: 400,
      body: new Error('Missing param: name')
    }
  }
}