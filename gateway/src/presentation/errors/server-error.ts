export class ServerError extends Error {
  constructor (error: Error) {
    super('Intern error')
    this.name = 'ServerError'
    this.stack = error.stack
  }
}