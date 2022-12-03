import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { CurrencyRate } from './entities/currency-rate.entity';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
  ) { }

  getCurrencyList() {
    return this.currencyRepository.find();
  }

  getCurrencyById(id: number) {
    try {
      let currency = this.currencyRepository.findOneOrFail({
        where: {
          id: id
        }
      });
      return currency;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  getCurrencyByCode(code: number) {
    try {
      let currency = this.currencyRepository.findOneOrFail({
        where: {
          code: code
        }
      });
      return currency;
    } catch (error) {
      throw new NotFoundException();
    }
  } 

  getCurrencyRateByCurrencyId(id: number) {
    try {
      let rate = this.currencyRateRepository.findOneOrFail({
        where: {
          currency: {
            id: id
          }
        }
      });
      return rate;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  insertCurrencyRates(rates: CreateCurrencyRateDto[]) {
    return this.currencyRateRepository.save(rates);
  }
}
