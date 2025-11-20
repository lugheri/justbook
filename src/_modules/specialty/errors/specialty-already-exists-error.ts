export class SpecialtyAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Esta especialidade já foi cadastrada. Por favor, escolha outro nome para sua nova conta.',
    )
  }
}
