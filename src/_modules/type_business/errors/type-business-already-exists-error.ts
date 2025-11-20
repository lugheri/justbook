export class TypeBusinessAlreadyExistsError extends Error {
  constructor() {
    super('Ops! Este nicho já foi cadastrado.')
  }
}
