import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ok = (body?: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const created = (body?: any): HttpResponse => ({
  statusCode: 201,
  body
})

export const serverError = (body?: any): HttpResponse => ({
  statusCode: 500,
  body
})
