import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Currency } from 'src/currency/entities/currency.entity';
import { DecimalTransformer } from 'src/shared/decimal-transformer';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, currency => currency.rates)
  currency: Currency;

  @Column({type: 'decimal', precision: 10, scale: 4, transformer: new DecimalTransformer()})
  rate: number;

  @CreateDateColumn()
  created: Date;
}
