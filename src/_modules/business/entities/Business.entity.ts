export class BusinessEntity {
  constructor(
    public readonly id: number,
    public readonly business_name: string,
    public readonly company_name: string,
    public readonly type_business: number,
    public readonly email: string,
    public readonly phone: string,
    public readonly whatsapp: string,
    public readonly address: string,
    public readonly address_2: string,
    public readonly plan: number,
    public readonly terms_agreed: number,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
    public readonly active: number,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }

  isAgreed(): boolean {
    return this.terms_agreed === 1
  }
}
