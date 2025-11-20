export class SpecialtyEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
    public readonly active: number,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
