export class ProductAlreadyExistsError extends Error {
  constructor() {
    super('Ops! Este produto já foi cadastrado.')
  }
}
