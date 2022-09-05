import { HttpResponse } from '../protocols'

export const ok = (body?: Record<string, any>): HttpResponse => ({
  statusCode: 200,
  body,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error,
  },
})
