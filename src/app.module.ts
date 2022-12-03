import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from './currency/currency.module';
import { TypeOrmConfigService } from './shared/typeorm.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
