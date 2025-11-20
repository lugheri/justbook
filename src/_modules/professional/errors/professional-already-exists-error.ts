export class ProfessionalAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe um Profissional cadastrado com este nome. Por favor, escolha outro nome para sua nova conta.',
    )
  }
}
