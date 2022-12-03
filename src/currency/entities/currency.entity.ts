import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { CurrencyRate } from 'src/currency/entities/currency-rate.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar'})
  label: string;

  @Column()
  code: number;

  @CreateDateColumn()
  created: Date;

  @OneToMany(() => CurrencyRate, currencyRate => currencyRate.currency)
  rates: CurrencyRate[];
}
