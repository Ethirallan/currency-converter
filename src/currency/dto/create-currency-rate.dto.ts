import { CreateCurrencyDto } from './create-currency.dto';

export class CreateCurrencyRateDto {
  id: number;
  currency: CreateCurrencyDto;
  rate: number;

  constructor() {}
}
