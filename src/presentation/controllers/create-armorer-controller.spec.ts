import { describe, it, expect } from 'vitest'
import { CreateArmorerController } from './create-armorer-controller'
import { MissingParamError } from '../errors/missing-params-error'

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
    expect(httpResponse.body).toEqual(new MissingParamError('name'))

  })

  it('should return 400 if no email is provided', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        registration: 'any-registration',
        name: 'any-name',
        // email: 'any-email@mail.com',
        password: 'any-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))

  })

  it('should return 400 if no password is provided', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        registration: 'any-registration',
        name: 'any-name',
        email: 'any-email@mail.com',
        // password: 'any-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))

  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        registration: 'any-registration',
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        // passwordConfirmation: 'any-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))

  })

  it('should return 400 if passwords does not match', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        registration: 'any-registration',
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'different-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Password and password confirmation must be equal'))

  })

  it('should return 400 if no registration is provided', () => {
    const sut = new CreateArmorerController()

    const httpRequest = {
      body: {
        // registration: 'any-registration',
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        phone: 'any-phone',
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('registration'))

  })
})