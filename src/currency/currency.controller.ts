import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { HttpService } from '@nestjs/axios';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { CurrencyRate } from './entities/currency-rate.entity';
import Big from 'big.js';

class ConvertPayload {
  currencyFrom: number;
  currencyTo: number;
  amount: number;

  constructor() {}
}

@Controller('currency')
export class CurrencyController {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly httpService: HttpService,
  ) { }

  @Get('getCurrencyList')
  getCurrencyList() {
    return this.currencyService.getCurrencyList();
  }

  @Post('convert')
  async convert(@Body() body: ConvertPayload) {
    console.log(body);
    const rateFrom = await this.currencyService.getCurrencyRateByCurrencyId(body.currencyFrom);
    const rateTo = await this.currencyService.getCurrencyRateByCurrencyId(body.currencyTo);

    return new Big(rateTo.rate / rateFrom.rate * body.amount).toFixed(5);
  }

  // daily cron job
  @Get('getLastConversionRates')
  async getLastConversionRates() {
    const ratesEU = await this.httpService.axiosRef.get('https://www.bsi.si/_data/tecajnice/dtecbs.xml');
    const ratesOthers = await this.httpService.axiosRef.get('https://bankaslovenije.blob.core.windows.net/extra-files/EksotTecBS.xml');

    const validEU = XMLValidator.validate(ratesEU.data);
    const validOthers = XMLValidator.validate(ratesOthers.data);
    if (validEU && validOthers) {
      const options = {
        ignoreAttributes: false
      }

      const parser = new XMLParser(options);
      const jsonEU = parser.parse(ratesEU.data);
      const jsonOthers = parser.parse(ratesOthers.data);

      const dataEU = jsonEU['DtecBS']['tecajnica']['tecaj'];
      const dataOthers = jsonOthers['EksotTecBS']['tecajnica']['tecaj'];

      let newRates: CreateCurrencyRateDto[] = [];

      let eur = new CurrencyRate();
      eur.rate = 1;
      eur.currency = await this.currencyService.getCurrencyById(1);
      newRates.push(eur);

      for (let el of [...dataEU, ...dataOthers]) {
        let newRate = new CreateCurrencyRateDto();
        newRate.rate = el['#text'];
        newRate.currency = await this.currencyService.getCurrencyByCode(Number.parseInt(el['@_sifra']));
        newRates.push(newRate);
      }

      this.currencyService.insertCurrencyRates(newRates);
      return newRates;
    }
  }
}
