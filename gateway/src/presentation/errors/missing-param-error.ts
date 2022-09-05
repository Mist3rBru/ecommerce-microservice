export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Required field: ${param}`)
    this.name = 'MissingParamError'
  }
}