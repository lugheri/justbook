export class ProfessionalEntity {
  constructor(
    public readonly id: number,
    public readonly business_id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly whatsapp: string,
    public readonly photo_profile: number | null,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
    public readonly active: number,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
