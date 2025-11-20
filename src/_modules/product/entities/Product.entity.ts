export class ProductEntity {
  constructor(
    public readonly id: number,
    public readonly business_id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly duration_minutes: number,
    public readonly professional: number,
    public readonly price: string,
    public readonly color_tag: string,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
    public readonly active: number,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
