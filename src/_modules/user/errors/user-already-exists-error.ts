export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Ops! Já existe uma Usuário com este email cadastrado.')
  }
}
