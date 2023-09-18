import { describe, it, expect } from 'vitest'
import { CreateArmorerController } from './create-armorer-controller'

describe('CreateArmorerController', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        registration: 'any-registration',
        // name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))

  })
})