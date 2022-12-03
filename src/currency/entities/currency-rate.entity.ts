import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Currency } from 'src/currency/entities/currency.entity';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, currency => currency.rates)
  currency: Currency;

  @Column()
  rate: number;

  @CreateDateColumn()
  created: Date;
}
