export interface ICreateUser {
  create(params: ICreateUser.Params): Promise<ICreateUser.Result>
}

export namespace ICreateUser {
  export interface Params {
    name: string
    email: string
    password: string
  }

  export interface Result {
    id: string
    name: string
    email: string
  }
}
