export class PlanEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly vigency: 'monthly' | 'annual',
    public readonly pay_day: number,
    public readonly monthly_fee: string,
    public readonly annual_price: string,
    public readonly start_date: Date,
    public readonly expiration_date: Date,
  ) {}

  isExpired(): boolean {
    return this.expiration_date.getTime() <= new Date().getTime()
  }

  isActive(): boolean {
    return this.expiration_date.getTime() > new Date().getTime()
  }
}
