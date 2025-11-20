export class ResourceNotFoundError extends Error {
  constructor() {
    super('O recurso selecionado não existe.')
  }
}
