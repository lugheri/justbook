export class BusinessAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe uma Empresa cadastrada com este nome. Por favor, escolha outro nome para sua nova conta.',
    )
  }
}
