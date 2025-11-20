export class CustomerAlreadyExistsError extends Error {
  constructor() {
    super('Ops! Já existe um cliente cadastrado com esse nome.')
  }
}
